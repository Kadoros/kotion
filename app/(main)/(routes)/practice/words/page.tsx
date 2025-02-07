"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronDown,
  Volume2,
  Sun,
  Moon,
  Plus,
  PlusCircle,
  ArrowDownAZ,
  ClockArrowDown,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
import SimpleWordCard from "./_components/simple-word-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import WordListAddBtnComponent from "./_components/wordList-add-button";
import { redirect } from "next/navigation";
import AddWordCard from "./_components/add-word-card";
import { Doc } from "@/convex/_generated/dataModel";
import ExtendedWordCard from "./_components/extended-word-card";

import { ScrollArea } from "@/components/ui/scroll-area";
import WordInitGate from "./_components/word-init-gate";

import { motion } from "framer-motion";

const WordPractice = () => {
  const words = useQuery(api.words.getWords, {});
  const wordLists = useQuery(api.wordLists.getWordLists);

  const [selectedList, setSelectedList] = useState<Doc<"wordLists"> | null>(
    null
  );
  const [filteredWords, setFilteredWords] = useState<Doc<"words">[]>([]);
  const [selectedWord, setSelectedWord] = useState<Doc<"words"> | null>(null); // New selectedWord state
  const [sortMethod, setSortMethod] = useState<"alphabetical" | "recent">(
    "alphabetical"
  );

  const [sortedWords, setSortedWords] = useState<Doc<"words">[]>([]);

  // Mock data for the filter options
  const options: (Doc<"wordLists"> | { _id: null; name: string })[] = [
    { _id: null, name: "All" }, // Special case for "All"
    ...(wordLists || []),
  ];

  const handleSelect = (value: string) => {
    setSelectedList(
      value === "all"
        ? null
        : wordLists?.find((list) => list._id === value) || null
    );
  };

  useEffect(() => {
    if (!words) return;

    if (!selectedList || selectedList._id === null) {
      setFilteredWords(words); // Show all words if "All" is selected
    } else {
      setFilteredWords(
        words.filter((word) => word.wordListId === selectedList._id)
      );
    }
  }, [words, selectedList]);

  useEffect(() => {
    if (!filteredWords) return;

    const sorted = [...filteredWords].sort((a, b) => {
      if (sortMethod === "alphabetical") {
        return a.word.localeCompare(b.word);
      } else {
        return b._creationTime - a._creationTime;
      }
    });

    setSortedWords(sorted);
  }, [sortMethod, filteredWords]);

  // Handle word selection
  const handleWordSelect = (word: Doc<"words">) => {
    if (selectedWord == word) {
      setSelectedWord(null);
    } else {
      setSelectedWord(word);
    }
  };

  return (
    <>
      <WordInitGate wordLists={wordLists}>
        <div className="flex flex-col h-screen bg-gray-50 dark:bg-[#1F1F1F] text-gray-900 dark:text-gray-100 p-4 justify-center items-center">
          {/* Main Content */}
          <div className="flex w-full max-w-7xl mx-auto h-full justify-center p-4">
            <div
              className={`${
                selectedWord ? "w-1/2 pr-4" : "w-full"
              } flex flex-col max-w-md h-full  `}
            >
              <div className="flex flex-col items-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mb-4 flex items-center justify-center ">
                  <div className="w-14 h-14 bg-white dark:bg-white/90 rounded-xl -translate-x-1 -translate-y-1" />
                </div>
                <h1 className="text-2xl font-bold mb-4">Practice your words</h1>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  START NOW
                </Button>
              </div>

              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-bold">
                  {sortedWords.length} words
                  <Button
                    variant={"ghost"}
                    onClick={() => {
                      if (sortMethod === "alphabetical") {
                        setSortMethod("recent");
                      } else {
                        setSortMethod("alphabetical");
                      }
                    }}
                  >
                    {sortMethod === "alphabetical" ? (
                      <ArrowDownAZ />
                    ) : (
                      <ClockArrowDown />
                    )}
                  </Button>
                </span>
                <div className="flex items-center gap-x-2">
                  <Select onValueChange={handleSelect}>
                    <SelectTrigger className="w-[180px] text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      {options.map((option) => (
                        <SelectItem
                          key={option._id ?? "all"}
                          value={option._id ?? "all"}
                        >
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <WordListAddBtnComponent />
                </div>
              </div>

              <ScrollArea className="h-full overflow-y-auto">
                <div className="space-y-2 h-full">
                  <AddWordCard wordList={selectedList} />

                  {sortedWords.map((word, index) => (
                    <SimpleWordCard
                      word={word}
                      key={index}
                      onClick={() => {
                        handleWordSelect(word);
                      }} // Handle word selection
                      selectedWord={selectedWord} // Optional: Highlight selected word
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Conditionally Render the Right Column */}
            {selectedWord && (
              <div className="w-1/2 pl-4 flex justify-center">
                <div className="justify-center items-center w-full">
                  <ExtendedWordCard word={selectedWord} />
                </div>
              </div>
            )}
          </div>
        </div>
      </WordInitGate>
    </>
  );
};

export default WordPractice;
