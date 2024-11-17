import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import archiver from "archiver";
import { Readable } from "stream";
import { getErrorMessage } from "@/lib/utils";

const MAX_ZIP_SIZE = 500 * 1024 * 1024; // 500MB limit

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
    const folderPath = request.nextUrl.searchParams.get("path");

    if (!folderPath) {
      return NextResponse.json(
        { error: "Folder path is required" },
        { status: 400 }
      );
    }

    const fullPath = path.join(process.cwd(), "public", "files", folderPath);
    const validatedPath = validatePath(fullPath);

    if (
      !fs.existsSync(validatedPath) ||
      !fs.statSync(validatedPath).isDirectory()
    ) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    // Calculate folder size
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
        { error: "Folder size exceeds maximum limit of 500MB" },
        { status: 413 }
      );
    }

    // Create the ZIP archive
    const archive = archiver("zip", { zlib: { level: 9 } });
    const stream = new Readable().wrap(archive);

    // Add files and directories recursively
    const addFilesToArchive = (currentPath: string, relativePath: string = "") => {
      const items = fs.readdirSync(currentPath);
      items.forEach((item) => {
        const itemPath = path.join(currentPath, item);
        const itemRelativePath = path.join(relativePath, item);
        const stats = fs.statSync(itemPath);

        if (stats.isFile()) {
          archive.file(itemPath, { name: itemRelativePath });
        } else if (stats.isDirectory()) {
          archive.directory(itemPath, itemRelativePath);
        }
      });
    };
    addFilesToArchive(validatedPath);

    // Finalize the archive
    archive.finalize();

    // Respond with the ZIP file stream
    return new NextResponse(stream as any, {
      headers: {
        "Content-Disposition": `attachment; filename=${encodeURIComponent(
          path.basename(folderPath)
        )}.zip`,
        "Content-Type": "application/zip",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Error creating ZIP archive:", error);
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
