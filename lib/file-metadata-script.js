const fs = require('fs');
const path = require('path');

function getDirectoryStructure(dirPath, rootDir) {
  const items = fs.readdirSync(dirPath);
  const result = [];

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
const rootDir = 'C:\\WS\\kotion2\\kotion\\public\\files';
const directoryStructure = getDirectoryStructure(rootDir, rootDir);

// Output the result to a .json file
fs.writeFileSync('directoryStructure.json', JSON.stringify(directoryStructure, null, 2));
