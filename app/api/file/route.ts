import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { getErrorMessage } from "@/lib/utils";
import { FileSystemItem } from "@/types";

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
    const relativePath = (req.query.path as string) || "";
    const fullPath = path.join(process.cwd(), "public", "files", relativePath);

    // Validate path
    const validatedPath = validatePath(fullPath);

    if (!fs.existsSync(validatedPath)) {
      return res.status(404).json({ error: "Path not found" });
    }

    const stats = fs.statSync(validatedPath);
    if (!stats.isDirectory()) {
      return res.status(400).json({ error: "Path is not a directory" });
    }

    const items = fs.readdirSync(validatedPath);
    const fileSystemItems: FileSystemItem[] = await Promise.all(
      items.map(async (item) => {
        const itemPath = path.join(validatedPath, item);
        const relativeItemPath = path.join(relativePath, item);
        const stats = fs.statSync(itemPath);

        if (stats.isFile()) {
          return {
            name: item,
            path: relativeItemPath.replace(/\\/g, "/"),
            type: "file",
            size: stats.size,
            modifiedAt: stats.mtime.toISOString(),
          };
        }

        return {
          name: item,
          path: relativeItemPath.replace(/\\/g, "/"),
          type: "directory",
          modifiedAt: stats.mtime.toISOString(),
          children: [], // Initialize empty children array for directories
        };
      })
    );

    // Sort directories first, then files, both alphabetically
    fileSystemItems.sort((a, b) => {
      if (a.type === b.type) {
        return a.name.localeCompare(b.name);
      }
      return a.type === "directory" ? -1 : 1;
    });

    return res.status(200).json(fileSystemItems);
  } catch (error) {
    console.error("Error reading directory:", error);
    return res.status(
      error instanceof Error && error.message.includes("Directory traversal")
        ? 403
        : 500
    ).json({ error: getErrorMessage(error) });
  }
}
