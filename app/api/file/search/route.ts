import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";
import { getErrorMessage } from "@/lib/utils";
import { FileSystemItem } from "@/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const query = req.query.q as string;
    const type = req.query.type as string;

    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const baseDir = path.join(process.cwd(), "public", "files");
    const results: FileSystemItem[] = [];

    // Recursive function to search files and directories
    const searchFiles = (dir: string, relativePath: string = "") => {
      const items = fs.readdirSync(dir);

      for (const item of items) {
        const fullPath = path.join(dir, item);
        const itemRelativePath = path.join(relativePath, item);
        const stats = fs.statSync(fullPath);

        const isMatch = item.toLowerCase().includes(query.toLowerCase());
        const itemType = stats.isDirectory() ? "directory" : "file";

        if (isMatch && (!type || type === itemType)) {
          const fileSystemItem: FileSystemItem = {
            name: item,
            path: itemRelativePath.replace(/\\/g, "/"),
            type: itemType,
            modifiedAt: stats.mtime.toISOString(),
          };

          if (stats.isFile()) {
            fileSystemItem.size = stats.size;
          } else {
            fileSystemItem.children = [];
          }

          results.push(fileSystemItem);
        }

        if (stats.isDirectory()) {
          searchFiles(fullPath, itemRelativePath);
        }
      }
    };

    searchFiles(baseDir);

    // Sort results: directories first, then files, both alphabetically
    results.sort((a, b) => {
      if (a.type === b.type) {
        return a.name.localeCompare(b.name);
      }
      return a.type === "directory" ? -1 : 1;
    });

    return res.status(200).json(results);
  } catch (error) {
    console.error("Error searching files:", error);
    return res.status(500).json({
      error: getErrorMessage(error) || "An error occurred while searching files.",
    });
  }
}
