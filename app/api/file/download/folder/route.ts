import fs from "fs";
import path from "path";
import archiver from "archiver";
import { NextApiRequest, NextApiResponse } from "next";
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const folderPath = req.query.path as string;

    if (!folderPath) {
      return res.status(400).json({ error: "Folder path is required" });
    }

    const fullPath = path.join(process.cwd(), "public", "files", folderPath);
    const validatedPath = validatePath(fullPath);

    // Check if folder exists and is a directory
    if (
      !fs.existsSync(validatedPath) ||
      !fs.statSync(validatedPath).isDirectory()
    ) {
      return res.status(404).json({ error: "Folder not found" });
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
      return res.status(413).json({
        error: "Folder size exceeds maximum limit of 500MB",
      });
    }

    // Create a zip archive
    const archive = archiver("zip", {
      zlib: { level: 9 }, // Maximum compression
    });

    res.setHeader("Content-Disposition", `attachment; filename=${encodeURIComponent(path.basename(folderPath))}.zip`);
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Cache-Control", "no-cache");

    // Pipe the archive to the response
    archive.pipe(res);

    // Function to recursively add files to archive
    const addFilesToArchive = (currentPath: string, relativePath: string = "") => {
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
  } catch (error) {
    console.error("Error creating zip archive:", error);
    return res.status(error instanceof Error && error.message.includes("Directory traversal") ? 403 : 500).json({
      error: getErrorMessage(error),
    });
  }
}
