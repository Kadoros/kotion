"use client";
import React, { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import ProgressNavigation from "@/components/global/progress-navigation";
import { Doc, Id } from "@/convex/_generated/dataModel";

import WordCard from "./_components/word-card-reviewer";
import { useSearchParams } from "next/navigation";
import KnowCard from "./_components/know-card";
import WordMemorizingInitPage from "./_components/word-memorizing-init-page";

const WordMemorizingPage: React.FC = () => {
  const searchParams = useSearchParams();
  const wordListId =
    (searchParams.get("word-list") as Id<"wordLists">) || "all";

  const words = useQuery(
    wordListId === "all" ? api.words.getWords : api.words.getWordsByWordListId,
    wordListId === "all" ? {} : { wordListId }
  );

  return <WordMemorizingInitPage words={words ?? []} />;
};

export default WordMemorizingPage;
