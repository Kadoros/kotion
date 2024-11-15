"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Globe2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Initialize the Gemini API (ensure to import the correct API)
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { DictionaryCardProps, TranslatorCardProps } from "@/types";

// Initialize API client
const genAI = new GoogleGenerativeAI("AIzaSyBTESkh_gID_pPLLU2mXw_d4Tsg87C8T1Q");  // Assuming the API Key is stored in .env.local

const schema = {
  description: "Translation Response Schema",
  type: SchemaType.OBJECT,
  properties: {
    translatedText: {
      type: SchemaType.STRING,
      description: "The translated text",
    },
    detectedLanguage: {
      type: SchemaType.OBJECT,
      properties: {
        confidence: { type: SchemaType.NUMBER },
        language: { type: SchemaType.STRING },
      },
    },
  },
  required: ["translatedText"],
};

// Get the model for content generation
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",  // Ensure this model is correct and available
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: schema,
  },
});

const TranslatorCard: React.FC<TranslatorCardProps> = ({ text, className }) => {
  const [translation, setTranslation] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!text?.trim()) {
        setTranslation(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Prepare the prompt for the translation request
        const prompt = `Translate the word: ${text} to Korean using this JSON schema:
        TranslationResponse = {translatedText: string; detectedLanguage?: {confidence: number; language: string;} }`;

        // Send the request to the Gemini API
        const result = await model.generateContent(prompt);

        // Handle the API response
        if (result.response && result.response.text()) {
          const translationData = JSON.parse(result.response.text());
          setTranslation(translationData.translatedText);
        } else {
          throw new Error("No translation data found in response");
        }
      } catch (err: any) {
        setError("Failed to fetch translation. Please try again.");
        console.error("Error fetching translation:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [text]);

  // Handle cases for empty text input
  if (!text?.trim()) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-6">
          <Alert>
            <AlertDescription>Please enter a word to see its definition and translation.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Show loading skeleton while waiting for the response
  if (loading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="space-y-4 p-6">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
      </Card>
    );
  }

  // Handle error response from API or other failures
  if (error) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Display the translation result
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Translation Result</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {translation && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Globe2 className="h-5 w-5" />
              <h3 className="font-semibold">Korean Translation</h3>
            </div>
            <p className="text-lg">{translation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TranslatorCard;
