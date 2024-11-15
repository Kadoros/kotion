import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { text } = await req.json();

  const IAM_TOKEN = process.env.NEXT_PUBLIC_YANDEX_IAM_TOKEN;
  const folderId = process.env.NEXT_PUBLIC_YANDEX_FOLDER_ID;

  if (!IAM_TOKEN || !folderId) {
    return NextResponse.json({ error: "Missing IAM token or Folder ID" }, { status: 400 });
  }

  const requestBody = {
    folderId,
    texts: [text],
    targetLanguageCode: "ko", // Korean target language
  };

  try {
    const response = await fetch("https://translate.api.cloud.yandex.net/translate/v2/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${IAM_TOKEN}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      return NextResponse.json(errorResponse, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ translation: data.translations[0]?.text || "No translation found." });
  } catch (err: unknown) {
    // Type assertion to 'Error' to access the 'message' property
    if (err instanceof Error) {
      return NextResponse.json({ error: "Translation API request failed", details: err.message }, { status: 500 });
    }

    // Fallback for unknown error type
    return NextResponse.json({ error: "Translation API request failed", details: "Unknown error" }, { status: 500 });
  }
}
