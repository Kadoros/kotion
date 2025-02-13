"use client";
import React, { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import ProgressNavigation from "@/components/global/progress-navigation";
import { Doc, Id } from "@/convex/_generated/dataModel";

import WordCard from "./word-card-reviewer";
import { useRouter, useSearchParams } from "next/navigation";
import KnowCard from "./know-card";
interface WordMemorizingInitPageProps {
  words: Doc<"words">[];
}

const WordMemorizingInitPage: React.FC<WordMemorizingInitPageProps> = ({
  words,
}) => {
    const router = useRouter();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [wordGradeMap, setWordGradeMap] = useState<{ [key: string]: number }>(
    {}
  );

  const [grade5Words, setGrade5Words] = useState<Doc<"words">[]>([]);
  const [flag, setFlag] = useState<boolean>(false);

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

  // New useEffect to update grade5Words when entering step 3
  useEffect(() => {
    if (currentStep === 3 && words && !flag) {
      const grade5Words = words.filter((word) => wordGradeMap[word._id] === 5);
      setGrade5Words(grade5Words);
      setFlag(true);
      console.log(grade5Words);
    }
  }, [currentStep, words, wordGradeMap]);

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
                  <button
                    onClick={() => router.push("/practice-hub/words")}
                    className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    Restart
                  </button>
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
