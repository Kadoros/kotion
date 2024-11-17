// app/api/file/download/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getErrorMessage } from "@/lib/utils";

function validatePath(fullPath: string) {
  const normalizedPath = path.normalize(fullPath);
  const baseDir = path.join(process.cwd(), "public", "files");
  if (!normalizedPath.startsWith(baseDir)) {
    throw new Error("Invalid path: Directory traversal detected");
  }
  return normalizedPath;
}

function getMimeType(filePath: string): string {
  const extension = path.extname(filePath).toLowerCase();
  const mimeTypes: { [key: string]: string } = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".pdf": "application/pdf",
    ".doc": "application/msword",
    ".docx":
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".xls": "application/vnd.ms-excel",
    ".xlsx":
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".zip": "application/zip",
    ".txt": "text/plain",
    ".mp3": "audio/mpeg",
    ".mp4": "video/mp4",
  };
  return mimeTypes[extension] || "application/octet-stream";
}
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const encodedPath = body.path;

    if (!encodedPath) {
      return NextResponse.json(
        { error: "File path is required" },
        { status: 400 }
      );
    }

    const decodedPath = decodeURIComponent(encodedPath); // Decode the path
    const fullPath = path.join(process.cwd(), "public", "files", decodedPath);
    const validatedPath = validatePath(fullPath);

    // Check if file exists and is not a directory
    if (
      !fs.existsSync(validatedPath) ||
      fs.statSync(validatedPath).isDirectory()
    ) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const file = fs.readFileSync(validatedPath);
    const stats = fs.statSync(validatedPath);
    const mimeType = getMimeType(validatedPath);

    return new NextResponse(file, {
      headers: {
        "Content-Disposition": `attachment; filename=${encodeURIComponent(
          path.basename(decodedPath)
        )}`,
        "Content-Type": mimeType,
        "Content-Length": stats.size.toString(),
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Error downloading file:", error);
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
