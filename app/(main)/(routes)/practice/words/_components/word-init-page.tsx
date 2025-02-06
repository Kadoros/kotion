"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  List,
  Check,
  Info,
} from "lucide-react";
import ProgressNavigation from "@/components/global/progress-navigation "; // Adjust the import path
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { redirect, useRouter } from "next/navigation";

const WordMemorizingIntroduction = () => {
  const [wordlistName, setWordlistName] = useState("");
  const [wordlistType, setWordlistType] = useState<"meaning" | "definition">(
    "meaning"
  );
  const router = useRouter();

  const create = useMutation(api.wordLists.create);

  // Redirect if word lists already exist

  const handleSubmit = async () => {
    try {
      const promise = create({ name: wordlistName, mode: wordlistType }).then(
        () => {
          router.replace("/practice/words");
        }
      );

      toast.promise(promise, {
        loading: "Creating word list...",
        success: "Word list created successfully!",
        error: "Failed to create word list.",
      });
    } catch (error) {
      toast.error("An error occurred while creating the word list.");
    }
  };

  return (
    <ProgressNavigation
      totalSteps={5} // Increased total steps
      title="Welcome to Word Memorizer"
      subtitle="Let's get started with creating your wordlist"
    >
      {(currentStep) => (
        <div className="space-y-8 max-w-2xl mx-auto">
          {currentStep === 1 && (
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <BookOpen className="w-12 h-12 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold">Welcome to Word Memorizer!</h3>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                This app helps you memorize words efficiently by creating
                personalized wordlists. Let's walk through the steps to create
                your first wordlist.
              </p>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <List className="w-12 h-12 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-center">
                What is a Wordlist?
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 text-center">
                A wordlist is a collection of words that you want to memorize.
                You can choose to memorize words along with their translations
                or their dictionary definitions.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h4 className="text-lg font-semibold mb-2">Meaning</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Memorize words and their translations.
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Example: &quot;Apple&quot; → &quot;りんご&quot; (Japanese)
                  </p>
                </div>
                <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h4 className="text-lg font-semibold mb-2">Definition</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Memorize words and their dictionary definitions.
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Example: &quot;Apple&quot; → &quot;A fruit with red or green
                    skin and a crisp flesh.&quot;
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <Info className="w-12 h-12 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-center">
                Name Your Wordlist
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 text-center">
                Give your wordlist a name to help you identify it later.
              </p>
              <input
                type="text"
                placeholder="Enter wordlist name"
                value={wordlistName}
                onChange={(e) => setWordlistName(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-lg"
              />
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <List className="w-12 h-12 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-center">
                Choose Wordlist Type
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 text-center">
                Select the type of wordlist you want to create:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  onClick={() => setWordlistType("meaning")}
                  className={`p-6 border rounded-lg text-left transition-all ${
                    wordlistType === "meaning"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <h4 className="text-lg font-semibold mb-2">Meaning</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Memorize words and their translations.
                  </p>
                </button>
                <button
                  onClick={() => setWordlistType("definition")}
                  className={`p-6 border rounded-lg text-left transition-all ${
                    wordlistType === "definition"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <h4 className="text-lg font-semibold mb-2">Definition</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Memorize words and their dictionary definitions.
                  </p>
                </button>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <Check className="w-12 h-12 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-center">
                Review and Confirm
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 text-center">
                Confirm your wordlist details:
              </p>
              <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
                <p className="text-lg">
                  <strong>Name:</strong> {wordlistName}
                </p>
                <p className="text-lg">
                  <strong>Type:</strong> {wordlistType}
                </p>
              </div>
              <Button onClick={handleSubmit} className="w-full text-lg py-6">
                Create Wordlist
              </Button>
            </div>
          )}
        </div>
      )}
    </ProgressNavigation>
  );
};

export default WordMemorizingIntroduction;
