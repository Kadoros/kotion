// import { NextRequest, NextResponse } from "next/server";
// import fs from "fs";
// import path from "path";
// import { getErrorMessage } from "@/lib/utils";
// import { FileSystemItem } from "@/types";

// // Function to validate and normalize paths
// function validatePath(fullPath: string) {
//   const normalizedPath = path.normalize(fullPath);
//   const baseDir = path.join(process.cwd(), "public", "files");
//   if (!normalizedPath.startsWith(baseDir)) {
//     throw new Error("Invalid path: Directory traversal detected");
//   }
//   return normalizedPath;
// }

// // POST handler to process file/directory paths
// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const relativePath = decodeURIComponent(body.path || ""); // Decode the path
//     const fullPath = path.join(process.cwd(), "public", "files", relativePath);

//     // Validate path
//     const validatedPath = validatePath(fullPath);

//     if (!fs.existsSync(validatedPath)) {
//       return NextResponse.json({ error: "Path not found" }, { status: 404 });
//     }

//     const stats = fs.statSync(validatedPath);
//     if (!stats.isDirectory()) {
//       return NextResponse.json(
//         { error: "Path is not a directory" },
//         { status: 400 }
//       );
//     }

//     const items = fs.readdirSync(validatedPath);
//     const fileSystemItems: FileSystemItem[] = await Promise.all(
//       items.map(async (item) => {
//         const itemPath = path.join(validatedPath, item);
//         const relativeItemPath = path.join(relativePath, item);
//         const stats = fs.statSync(itemPath);

//         if (stats.isFile()) {
//           return {
//             name: item,
//             path: relativeItemPath.replace(/\\/g, "/"),
//             type: "file",
//             size: stats.size,
//             modifiedAt: stats.mtime.toISOString(),
//           };
//         }

//         return {
//           name: item,
//           path: relativeItemPath.replace(/\\/g, "/"),
//           type: "directory",
//           modifiedAt: stats.mtime.toISOString(),
//           children: [],
//         };
//       })
//     );

//     // Sort directories first, then files, both alphabetically
//     fileSystemItems.sort((a, b) => {
//       if (a.type === b.type) {
//         return a.name.localeCompare(b.name);
//       }
//       return a.type === "directory" ? -1 : 1;
//     });

//     return NextResponse.json(fileSystemItems);
//   } catch (error) {
//     console.error("Error reading directory:", error);
//     return NextResponse.json(
//       { error: getErrorMessage(error) },
//       {
//         status:
//           error instanceof Error &&
//           error.message.includes("Directory traversal")
//             ? 403
//             : 500,
//       }
//     );
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import archiver from "archiver";
import { Readable } from "stream";
import { getErrorMessage } from "@/lib/utils";

export async function POST(request: NextRequest) {
  return new NextResponse("dev");
}
