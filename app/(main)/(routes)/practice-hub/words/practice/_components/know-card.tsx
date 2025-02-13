"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Input } from "@/components/ui/input"; // Assuming Shadcn UI Input component
import { Doc } from "@/convex/_generated/dataModel";

interface KnowCardProps {
  grade5Words: Doc<"words">[] | null | undefined;
  mode?: "word" | "meaning";
  onComplete: () => void;
  wordGradeMap: { [key: string]: number };
  setWordGradeMap: React.Dispatch<
    React.SetStateAction<{ [key: string]: number }>
  >;
}

const KnowCard: React.FC<KnowCardProps> = ({
  grade5Words,
  mode = "word",
  onComplete,
  setWordGradeMap,
}) => {
  if (!grade5Words || grade5Words.length === 0) {
    return <div>No words available</div>;
  }

  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);

  const [currentWord, setCurrentWord] = useState<Doc<"words"> | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [isAnimating, setIsAnimating] = useState<boolean>(false);


  // Update current word when index changes
  useEffect(() => {
    setCurrentWord(grade5Words[currentWordIndex] || null);
  }, [currentWordIndex, grade5Words]);

  const variants: Variants = {
    enter: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -200, transition: { duration: 0.25 } },
  };

  const handleResponse = (ans: string) => {
    if (isAnimating || !currentWord) return;

    setIsAnimating(true);

    const correctAnswer =
      mode === "word"
        ? currentWord.word
        : currentWord.meanings?.[0]?.definitions?.[0]?.definition || "";

    const grade = correctAnswer === ans ? 5 : 2;

    setWordGradeMap((prev) => {
      const newGrade = Math.round(((prev[currentWord._id] || 0) + grade) / 2);
      return { ...prev, [currentWord._id]: newGrade };
    });

    setTimeout(() => {
      setIsAnimating(false);
      setInputValue("");

      if (currentWordIndex >= grade5Words.length - 1) {
        setTimeout(onComplete, 300);
      } else {
        setCurrentWordIndex((prev) => prev + 1);
      }
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleResponse(inputValue);
  };

  return (
    <div className="space-y-8 flex flex-col items-center w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentWordIndex}
          variants={variants}
          initial={{ opacity: 0, x: 200 }}
          animate="enter"
          exit="exit"
          className="w-full aspect-[4/3] bg-white dark:bg-gray-800 rounded-lg shadow-lg flex items-center justify-center relative p-4"
        >
          <span
            className={`font-semibold text-gray-800 dark:text-gray-100 text-center ${
              (mode === "word" && (currentWord?.word?.length ?? 0) > 15) ||
              (mode === "meaning" &&
                (currentWord?.meanings?.[0]?.definitions?.[0]?.definition
                  ?.length ?? 0) > 50)
                ? "text-3xl"
                : "text-5xl"
            }`}
          >
            {mode === "word"
              ? currentWord?.word ?? ""
              : currentWord?.meanings?.[0]?.definitions?.[0]?.definition ?? ""}
          </span>
        </motion.div>
      </AnimatePresence>

      {/* Input Field */}
      <form onSubmit={handleSubmit} className="w-full flex justify-center">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your answer"
          className="w-full max-w-md"
        />
      </form>
    </div>
  );
};

export default KnowCard;
