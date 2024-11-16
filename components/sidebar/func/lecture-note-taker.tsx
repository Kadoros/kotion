"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Book, Globe2 } from "lucide-react";
import type {
  DictionaryEntry,
  TranslationResponse,
  DictionaryCardProps,
} from "@/types/index";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Status from "../status";
import { useVoiceNote } from "@/hook/use-voice-note";

interface LectureNoteTakerProps {
  className?: string;
}

const LectureNoteTaker: React.FC<LectureNoteTakerProps> = ({ className }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const voiceNote = useVoiceNote();

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

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="flex flex-col">
        <CardTitle className="text-xl font-bold">Lecture note taker</CardTitle>
        <Status status={"generating"} />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-y-2">
          <Button variant={"outline"} className="border-black">
            start listening
          </Button>
          <Button
            variant={"outline"}
            className="border-black"
            onClick={() => voiceNote.onOpen()}
          >
            upload lecture voice note
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LectureNoteTaker;
