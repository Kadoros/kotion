import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { getErrorMessage } from "@/lib/utils";

// Function to validate the file path and prevent directory traversal
function validatePath(fullPath: string) {
  const normalizedPath = path.normalize(fullPath);
  const baseDir = path.join(process.cwd(), "public", "files");
  if (!normalizedPath.startsWith(baseDir)) {
    throw new Error("Invalid path: Directory traversal detected");
  }
  return normalizedPath;
}

// Function to get the MIME type based on the file extension
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
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".xls": "application/vnd.ms-excel",
    ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".zip": "application/zip",
    ".txt": "text/plain",
    ".mp3": "audio/mpeg",
    ".mp4": "video/mp4",
  };
  return mimeTypes[extension] || "application/octet-stream";
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const filePath = req.query.path as string;

    if (!filePath) {
      return res.status(400).json({ error: "File path is required" });
    }

    const fullPath = path.join(process.cwd(), "public", "files", filePath);
    const validatedPath = validatePath(fullPath);

    // Check if file exists and is not a directory
    if (!fs.existsSync(validatedPath) || fs.statSync(validatedPath).isDirectory()) {
      return res.status(404).json({ error: "File not found" });
    }

    const file = fs.readFileSync(validatedPath);
    const stats = fs.statSync(validatedPath);
    const mimeType = getMimeType(validatedPath);

    res.setHeader("Content-Disposition", `attachment; filename=${encodeURIComponent(path.basename(filePath))}`);
    res.setHeader("Content-Type", mimeType);
    res.setHeader("Content-Length", stats.size.toString());
    res.setHeader("Cache-Control", "no-cache");

    return res.status(200).send(file);
  } catch (error) {
    console.error("Error downloading file:", error);
    return res.status(
      error instanceof Error && error.message.includes("Directory traversal") ? 403 : 500
    ).json({
      error: getErrorMessage(error) || "An error occurred while downloading the file.",
    });
  }
}
