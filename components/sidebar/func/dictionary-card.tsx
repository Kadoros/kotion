"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Book } from "lucide-react";
import type { DictionaryEntry, DictionaryCardProps } from "@/types/index";
import { cn } from "@/lib/utils";
import { SidebarGroup, SidebarMenu } from "@/components/ui/sidebarL";
import PlusIconButton from "@/components/global/add-button";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Id } from "@/convex/_generated/dataModel";

const DictionaryCard: React.FC<DictionaryCardProps> = ({ text, className }) => {
  const [definition, setDefinition] = useState<DictionaryEntry | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [wordListId, setWordListId] = useState<Id<"wordLists"> | null>(null); // Initialize with null

  // Fetch word lists using getWordList
  const wordLists = useQuery(api.wordLists.getWordLists);

  // Set the first word list as the default when wordLists are loaded
  useEffect(() => {
    if (wordLists && wordLists.length > 0 && !wordListId) {
      setWordListId(wordLists[0]._id); // Set the first word list as the default
    }
  }, [wordLists, wordListId]);

  useEffect(() => {
    const fetchData = async () => {
      if (!text?.trim()) {
        setDefinition(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const definitionResponse = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(text)}`
        );

        if (!definitionResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const definitionData: DictionaryEntry[] = await definitionResponse.json();
        setDefinition(definitionData[0]);
      } catch (err) {
        setError("Failed to fetch definition or translation. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [text]);

  if (!text?.trim()) {
    return (
      <SidebarGroup className="group-data-[collapsible=icon]:hidden p-0 ">
        <SidebarMenu>
          <Card className={cn("w-full", className)}>
            <CardContent className="p-6">
              <Alert>
                <AlertDescription>
                  Please enter a word to see its definition and translation.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  if (loading) {
    return (
      <SidebarGroup className="group-data-[collapsible=icon]:hidden p-0 ">
        <SidebarMenu>
          <Card className={cn("w-full", className)}>
            <CardContent className="space-y-4 p-6">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  if (error) {
    return (
      <SidebarGroup className="group-data-[collapsible=icon]:hidden p-0 ">
        <SidebarMenu>
          <Card className={cn("w-full", className)}>
            <CardContent className="p-6">
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden p-0 ">
      <SidebarMenu>
        <Card className={cn("w-full", className)}>
          <CardHeader>
            <CardTitle className="text-xl font-bold flex">
              <div>
                {text}
                {definition?.phonetic && (
                  <span className="ml-2 text-sm text-muted-foreground">
                    {definition.phonetic}
                    {definition.phonetics?.[0]?.audio && (
                      <button
                        onClick={() =>
                          new Audio(definition.phonetics[0].audio).play()
                        }
                        className="ml-1 text-blue-500 hover:underline"
                      >
                        🔊
                      </button>
                    )}
                  </span>
                )}
              </div>
              {/* Conditionally render PlusIconButton */}
              {wordLists && wordLists.length > 0 && (
                <PlusIconButton
                  className="ml-auto mt-1"
                  dictionaryEntry={definition}
                  wordListId={wordListId} // Pass the wordListId
                />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {definition && (
              <div className="space-y-4">
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <Book className="h-5 w-5" />
                    <h3 className="font-semibold">Definition</h3>
                  </div>
                  {/* Conditionally render the word list dropdown */}
                  {wordLists && wordLists.length > 0 && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <p className="text-sm text-gray-500 cursor-pointer hover:underline">
                          on "{wordLists.find((list) => list._id === wordListId)?.name || "Select a list"}"
                        </p>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {wordLists.map((list) => (
                          <DropdownMenuItem
                            key={list._id}
                            onClick={() => setWordListId(list._id)}
                          >
                            {list.name}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                <div className="space-y-2">
                  {definition.meanings?.map((meaning, index) => (
                    <div key={index} className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {meaning.partOfSpeech}
                      </p>
                      <ul className="list-disc pl-6 space-y-1">
                        {meaning.definitions?.slice(0, 3).map((def, idx) => (
                          <li key={idx} className="text-sm">
                            {def.definition}
                            {def.example && (
                              <p className="mt-1 text-xs text-muted-foreground">
                                Example: {def.example}
                              </p>
                            )}
                          </li>
                        ))}
                      </ul>
                      {meaning.synonyms.length > 0 && (
                        <p className="text-sm">
                          <span className="font-medium">Synonyms: </span>
                          {meaning.synonyms.slice(0, 5).join(", ")}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default DictionaryCard;