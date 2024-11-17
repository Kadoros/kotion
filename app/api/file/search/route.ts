import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getErrorMessage } from "@/lib/utils";
import { FileSystemItem } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const { query, type } = await request.json();

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    const baseDir = path.join(process.cwd(), "public", "files");
    const results: FileSystemItem[] = [];

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

    results.sort((a, b) => {
      if (a.type === b.type) {
        return a.name.localeCompare(b.name);
      }
      return a.type === "directory" ? -1 : 1;
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error searching files:", error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
