"use client";
import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import ProgressNavigation from "@/components/global/progress-navigation";
import { Doc, Id } from "@/convex/_generated/dataModel";
import WordCard from "./word-card-reviewer";
import { useRouter, useSearchParams } from "next/navigation";
import KnowCard from "./know-card";
import { SM2 } from "@/lib/sm2";
import { Button } from "@/components/ui/button";

interface WordMemorizingInitPageProps {
  words: Doc<"words">[];
}

const WordMemorizingInitPage: React.FC<WordMemorizingInitPageProps> = ({
  words,
}) => {
  const router = useRouter();
  const updateWords = useMutation(api.words.updateWords);

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [wordGradeMap, setWordGradeMap] = useState<{ [key: string]: number }>(
    {}
  );
  const [grade5Words, setGrade5Words] = useState<Doc<"words">[]>([]);
  const [flag, setFlag] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState(false);

  const handleWordCardCompleted = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  useEffect(() => {
    if (words) {
      setWordGradeMap((prev) => ({
        ...prev,
        ...words.reduce((acc, word) => ({ ...acc, [word._id]: -1 }), {}),
      }));
    }
  }, [words]);

  useEffect(() => {
    if (currentStep === 3 && words && !flag) {
      const grade5Words = words.filter((word) => wordGradeMap[word._id] === 5);
      setGrade5Words(grade5Words);
      setFlag(true);
    }
  }, [currentStep, words, wordGradeMap]);

  const handelFinish = async () => {
    try {
      console.log("Starting handelFinish...");

      const wordUpdates = words
        .map((word) => {
          const grade = wordGradeMap[word._id];

          if (grade === undefined) {
            console.error(`Skipping word ${word._id}: Grade is undefined`);
            return null;
          }

          const sm2Result = SM2.processItem(word, grade);

          if (!sm2Result) {
            console.error(`Skipping word ${word._id}: SM2 result is invalid`);
            return null;
          }

          const newProgress = 5;

          return {
            _id: word._id,
            last_review: Date.now(),
            progress: newProgress,
            ...sm2Result,
          };
        })
        .filter((update) => update !== null); // Remove null values

      console.log(
        "Word updates to be sent:",
        JSON.stringify(wordUpdates, null, 2)
      );

      await updateWords({ words: wordUpdates });
      console.log("Words updated successfully.");

      router.push("/practice-hub/words");
    } catch (error) {
      console.error("Error updating words:", error);
    }
  };
  if (!words) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <ProgressNavigation
        totalSteps={5}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        title="Word Memorization"
        subtitle="Multiple strategies to help you memorize words"
        buttonDisable
      >
        {(currentStep) => (
          <div className="space-y-8 max-w-2xl mx-auto">
            {currentStep === 1 && (
              <div className="flex flex-col items-center space-y-12 sm:space-y-16 md:space-y-24 lg:space-y-48 w-full">
                <WordCard
                  words={words}
                  wordGradeMap={wordGradeMap}
                  setWordGradeMap={setWordGradeMap}
                  onComplete={handleWordCardCompleted}
                />
              </div>
            )}

            {currentStep === 2 && (
              <div className="flex flex-col items-center space-y-12 sm:space-y-16 md:space-y-24 lg:space-y-48 w-full">
                <WordCard
                  words={words}
                  mode="meaning"
                  wordGradeMap={wordGradeMap}
                  setWordGradeMap={setWordGradeMap}
                  onComplete={handleWordCardCompleted}
                />
              </div>
            )}

            {currentStep === 3 && (
              <div className="flex flex-col items-center space-y-12 sm:space-y-16 md:space-y-24 lg:space-y-48 w-full">
                <KnowCard
                  grade5Words={grade5Words}
                  onComplete={handleWordCardCompleted}
                  wordGradeMap={wordGradeMap}
                  setWordGradeMap={setWordGradeMap}
                />
              </div>
            )}
            {currentStep === 4 && (
              <div className="flex flex-col items-center space-y-12 sm:space-y-16 md:space-y-24 lg:space-y-48 w-full">
                <KnowCard
                  grade5Words={grade5Words}
                  onComplete={handleWordCardCompleted}
                  wordGradeMap={wordGradeMap}
                  setWordGradeMap={setWordGradeMap}
                  mode="meaning"
                />
              </div>
            )}
            {currentStep === 5 && (
              <div className="flex flex-col items-center space-y-12 sm:space-y-16 md:space-y-24 lg:space-y-48 w-full">
                <div className="text-center">
                  <h2 className="text-2xl font-bold">Congratulations! 🎉</h2>
                  <p className="text-lg text-gray-600">
                    You've completed the word memorization process.
                  </p>
                  <Button
                    onClick={handelFinish}
                    disabled={isLoading} // Disable Button while loading
                    className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    {isLoading ? "Updating..." : "Finish"}{" "}
                    {/* Show loading text */}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </ProgressNavigation>
    </div>
  );
};

export default WordMemorizingInitPage;
