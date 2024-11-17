import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import archiver from "archiver";
import { getErrorMessage } from "@/lib/utils";

const MAX_ZIP_SIZE = 299 * 1024 * 1024; // 500MB limit

function validatePath(fullPath: string) {
  const normalizedPath = path.normalize(fullPath);
  const baseDir = path.join(process.cwd(), "public", "files");
  if (!normalizedPath.startsWith(baseDir)) {
    throw new Error("Invalid path: Directory traversal detected");
  }
  return normalizedPath;
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);

    const folderPath = url.searchParams.get("path");

    if (!folderPath) {
      return NextResponse.json(
        { error: "Folder path is required" },
        { status: 400 }
      );
    }

    const fullPath = path.join(process.cwd(), "public", "files", folderPath);
    const validatedPath = validatePath(fullPath);

    // Check if folder exists and is a directory
    if (
      !fs.existsSync(validatedPath) ||
      !fs.statSync(validatedPath).isDirectory()
    ) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    // Calculate total size before zipping
    let totalSize = 0;
    const calculateSize = (dirPath: string) => {
      const items = fs.readdirSync(dirPath);
      for (const item of items) {
        const itemPath = path.join(dirPath, item);
        const stats = fs.statSync(itemPath);
        if (stats.isFile()) {
          totalSize += stats.size;
        } else if (stats.isDirectory()) {
          calculateSize(itemPath);
        }
      }
    };
    calculateSize(validatedPath);

    if (totalSize > MAX_ZIP_SIZE) {
      return NextResponse.json(
        {
          error: "Folder size exceeds maximum limit of 500MB",
        },
        { status: 413 }
      );
    }

    // Create a zip archive
    const archive = archiver("zip", {
      zlib: { level: 9 }, // Maximum compression
    });

    // Set up response to stream the ZIP file
    const stream = new ReadableStream({
      start(controller) {
        archive.on("data", (chunk) => controller.enqueue(chunk));
        archive.on("end", () => controller.close());
        archive.on("error", (err) => controller.error(err));
      }
    });

    // Function to recursively add files to archive
    const addFilesToArchive = (
      currentPath: string,
      relativePath: string = ""
    ) => {
      const items = fs.readdirSync(currentPath);

      items.forEach((item) => {
        const itemPath = path.join(currentPath, item);
        const itemRelativePath = path.join(relativePath, item);
        const stat = fs.statSync(itemPath);

        if (stat.isFile()) {
          archive.file(itemPath, { name: itemRelativePath });
        } else if (stat.isDirectory()) {
          archive.directory(itemPath, itemRelativePath);
        }
      });
    };

    // Add files to archive
    addFilesToArchive(validatedPath);

    // Finalize the archive to start streaming
    archive.finalize();

    // Return the ZIP file as a stream
    return new NextResponse(stream, {
      headers: {
        "Content-Disposition": `attachment; filename=${encodeURIComponent(path.basename(folderPath))}.zip`,
        "Content-Type": "application/zip",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Error creating zip archive:", error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      {
        status:
          error instanceof Error &&
          error.message.includes("Directory traversal")
            ? 403
            : 500,
      }
    );
  }
}
