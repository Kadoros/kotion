// app/api/gemini/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize the Gemini model with your API key
const genAI = new GoogleGenerativeAI("AIzaSyBTESkh_gID_pPLLU2mXw_d4Tsg87C8T1Q");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Handle POST requests
export async function POST(req: Request) {
  try {
    // Parse the incoming JSON request body
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Generate content from the Gemini model
    const result = await model.generateContent(prompt);
    const generatedText = result.response.text();

    // Return the generated content as JSON
    return NextResponse.json({ text: generatedText }, { status: 200 });
  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}
