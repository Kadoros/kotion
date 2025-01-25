// pages/api/proxy-pdf/route.ts

import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  const { searchParams } = req.nextUrl;
  const url = searchParams.get('url');
  
  if (!url) {
    return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
  }

  try {
    // Fetch the PDF from the FAA server
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch PDF');
    }

    // Use arrayBuffer() to get the PDF content
    const arrayBuffer = await response.arrayBuffer();

    // Return the PDF content with proper headers
    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": "application/pdf",
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch the PDF" }, { status: 500 });
  }
};
