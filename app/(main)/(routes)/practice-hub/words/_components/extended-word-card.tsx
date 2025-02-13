"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Book } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import PlusIconButton from "@/components/global/add-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Doc } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

interface ExtendedWordCardProps {
  word: Doc<"words">;
}

const ExtendedWordCard: React.FC<ExtendedWordCardProps> = ({ word }) => {
  return (
    <Card
      className={cn(
        "w-full",
        "bg-white dark:bg-[#2A2A2A] border-gray-200 dark:border-gray-700"
      )}
    >
      <CardHeader>
        <CardTitle className="text-xl font-bold flex text-gray-900 dark:text-white">
          <div>
            {word.word}
            {word.phonetic && (
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                {word.phonetic}
                {word.phonetics?.[0]?.audio && (
                  <button
                    onClick={() => new Audio(word.phonetics[0].audio).play()}
                    className="ml-1 text-blue-500 dark:text-blue-400"
                  >
                    🔊
                  </button>
                )}
              </span>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {word.meanings && (
          <div className="space-y-4">
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <Book className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Definition
                </h3>
              </div>
            </div>

            <div className="space-y-2">
              {word.meanings.map((meaning, index) => (
                <div key={index} className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {meaning.partOfSpeech}
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    {meaning.definitions.slice(0, 3).map((def, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-gray-800 dark:text-gray-300"
                      >
                        {def.definition}
                        {def.example && (
                          <p className="mt-1 text-xs text-muted-foreground dark:text-gray-400">
                            Example: {def.example}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                  {meaning.synonyms.length > 0 && (
                    <p className="text-sm text-gray-800 dark:text-gray-300">
                      <span className="font-medium">Synonyms: </span>
                      {meaning.synonyms.slice(0, 5).join(", ")}
                    </p>
                  )}
                  {meaning.antonyms.length > 0 && (
                    <p className="text-sm text-gray-800 dark:text-gray-300">
                      <span className="font-medium">Antonyms: </span>
                      {meaning.antonyms.slice(0, 5).join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExtendedWordCard;
