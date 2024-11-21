import fs from 'fs';
import path from 'path';

interface DirectoryItem {
  name: string;
  type: 'directory' | 'file';
  path: string;
  size?: number;
  modifiedAt: string;
  children?: DirectoryItem[];
}

export function getDirectoryStructure(dirPath: string, rootDir: string): DirectoryItem[] {
  const items = fs.readdirSync(dirPath);
  const result: DirectoryItem[] = [];

  items.forEach((item) => {
    const itemPath = path.join(dirPath, item);
    const stats = fs.statSync(itemPath);

    // Normalize path to use forward slashes and remove the rootDir prefix
    const normalizedPath = itemPath.replace(/\\/g, '/').replace(rootDir.replace(/\\/g, '/'), '');

    if (stats.isDirectory()) {
      const children = getDirectoryStructure(itemPath, rootDir); // Recursive call for subfolders

      // Calculate the total size of the directory by summing the sizes of its files
      const totalSize = children.reduce((sum, child) => {
        return sum + (child.size || 0);
      }, 0);

      result.push({
        name: item,
        type: 'directory',
        path: normalizedPath,
        size: totalSize > 0 ? totalSize : undefined, // Only add size if it's more than 0
        modifiedAt: stats.mtime.toISOString(),
        children,
      });
    } else {
      result.push({
        name: item,
        type: 'file',
        path: normalizedPath,
        size: stats.size, // Actual size of the file in bytes
        modifiedAt: stats.mtime.toISOString(),
      });
    }
  });

  return result;
}

// Usage example: Change this to the directory you want to scan
const rootDir = path.resolve(__dirname, 'public'); // Use path.resolve to get relative path
const directoryStructure = getDirectoryStructure(rootDir, rootDir);

// Output the result to a .json file in the public directory
const outputFilePath = path.join(__dirname, '../public/directoryStructure.json');
fs.writeFileSync(outputFilePath, JSON.stringify(directoryStructure, null, 2));
