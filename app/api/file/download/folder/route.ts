// app/api/file/download/folder/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import { getErrorMessage } from '@/lib/utils';

const MAX_ZIP_SIZE = 500 * 1024 * 1024; // 500MB limit

function validatePath(fullPath: string) {
    const normalizedPath = path.normalize(fullPath);
    const baseDir = path.join(process.cwd(), 'public', 'files');
    if (!normalizedPath.startsWith(baseDir)) {
      throw new Error('Invalid path: Directory traversal detected');
    }
    return normalizedPath;
  }
  

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const folderPath = searchParams.get('path');
    
    if (!folderPath) {
      return NextResponse.json({ error: 'Folder path is required' }, { status: 400 });
    }

    const fullPath = path.join(process.cwd(), 'public', 'files', folderPath);
    const validatedPath = validatePath(fullPath);

    // Check if folder exists and is a directory
    if (!fs.existsSync(validatedPath) || !fs.statSync(validatedPath).isDirectory()) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
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
      return NextResponse.json({ 
        error: 'Folder size exceeds maximum limit of 500MB' 
      }, { status: 413 });
    }

    // Create a zip archive
    const archive = archiver('zip', {
      zlib: { level: 9 } // Maximum compression
    });

    // Create an array to store chunks of data
    const chunks: Uint8Array[] = [];

    // Handle archive data
    archive.on('data', (chunk) => chunks.push(chunk));

    // Handle archive warnings
    archive.on('warning', (err) => {
      if (err.code === 'ENOENT') {
        console.warn('Archive warning:', err);
      } else {
        throw err;
      }
    });

    // Handle archive errors
    archive.on('error', (err) => {
      throw err;
    });

    // Function to recursively add files to archive
    const addFilesToArchive = (currentPath: string, relativePath: string = '') => {
      const items = fs.readdirSync(currentPath);
      
      items.forEach(item => {
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

    // Finalize the archive and wait for it to finish
    await archive.finalize();

    // Create a buffer from the chunks
    const buffer = Buffer.concat(chunks);

    // Return the ZIP file
    return new NextResponse(buffer, {
      headers: {
        'Content-Disposition': `attachment; filename=${encodeURIComponent(path.basename(folderPath))}.zip`,
        'Content-Type': 'application/zip',
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'no-cache'
      },
    });
  } catch (error) {
    console.error('Error creating zip archive:', error);
    return NextResponse.json(
      { error: getErrorMessage(error) }, 
      { status: error instanceof Error && error.message.includes('Directory traversal') ? 403 : 500 }
    );
  }
}