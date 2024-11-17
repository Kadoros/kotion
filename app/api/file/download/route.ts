// app/api/file/download/folder/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import { Readable } from 'stream';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const folderPath = searchParams.get('path');
    
    if (!folderPath) {
      return NextResponse.json({ error: 'Folder path is required' }, { status: 400 });
    }

    const fullPath = path.join(process.cwd(), 'public', 'files', folderPath);

    // Check if folder exists and is a directory
    if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isDirectory()) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
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
    addFilesToArchive(fullPath);

    // Finalize the archive
    await archive.finalize();

    // Create a buffer from the chunks
    const buffer = Buffer.concat(chunks);

    // Return the ZIP file
    return new NextResponse(buffer, {
      headers: {
        'Content-Disposition': `attachment; filename=${path.basename(folderPath)}.zip`,
        'Content-Type': 'application/zip',
      },
    });
  } catch (error) {
    console.error('Error creating zip archive:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}