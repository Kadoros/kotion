"use client";
import React from "react";
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

const WordPractice = () => {
  const words = useQuery(api.words.getWords, {});
  const wordLists = useQuery(api.wordLists.getWordLists);
  if (!wordLists || wordLists.length === 0) {
    redirect("/practice/words/init");
  }
  // Mock data for the filter options
  const options = [
    { value: "all", label: "All" },

    ...(wordLists?.map((list) => ({
      value: list._id.toString(), // Assuming _id is unique
      label: list.name,
    })) || []),
  ];

  

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1F1F1F] text-gray-900 dark:text-gray-100 p-4">
      {/* Theme Toggle and Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <span className="text-gray-500 dark:text-gray-400 ml-2">
            Practice
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto">
        {/* Icon and Title */}
        <div className="flex flex-col items-center mb-8 ">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mb-4 flex items-center justify-center ">
            <div className="w-14 h-14 bg-white dark:bg-white/90 rounded-xl -translate-x-1 -translate-y-1" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Practice your words</h1>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            START NOW
          </Button>
        </div>

        {/* Word Count and Filter */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-bold">151 words</span>
          <div className="flex items-center gap-x-2">
            <Select>
              <SelectTrigger className="w-[180px] text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <WordListAddBtnComponent />
          </div>
        </div>

        {/* Word List */}
        <div className="space-y-2">
          {words &&
            words.map((word, index) => (
              <SimpleWordCard word={word} key={index} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default WordPractice;
