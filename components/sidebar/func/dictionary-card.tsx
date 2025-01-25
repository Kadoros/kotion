"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Book, Globe2, Plus, PlusCircle } from "lucide-react";
import type {
  DictionaryEntry,
  TranslationResponse,
  DictionaryCardProps,
} from "@/types/index";
import { cn } from "@/lib/utils";
import {
  SidebarGroup,
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebarL";
import { Button } from "@/components/ui/button";
import PlusIconButton from "@/components/global/add-button";

const DictionaryCard: React.FC<DictionaryCardProps> = ({ text, className }) => {
  const [definition, setDefinition] = useState<DictionaryEntry | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { isMobile } = useSidebar();
  useEffect(() => {
    const fetchData = async () => {
      if (!text?.trim()) {
        setDefinition(null);

        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch definition from Free Dictionary API
        const definitionResponse = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(text)}`
        );

        if (!definitionResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const definitionData: DictionaryEntry[] =
          await definitionResponse.json();

        setDefinition(definitionData[0]);
      } catch (err) {
        setError(
          "Failed to fetch definition or translation. Please try again."
        );
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
                  </span>
                )}
              </div>
              <PlusIconButton className="ml-auto mt-1"/>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {definition && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Book className="h-5 w-5" />
                  <h3 className="font-semibold">Definition</h3>
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
