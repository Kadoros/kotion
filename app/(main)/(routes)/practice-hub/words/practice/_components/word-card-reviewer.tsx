import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Doc } from "@/convex/_generated/dataModel";

interface WordCardProps {
  words: Doc<"words">[] | null | undefined;
  mode?: "word" | "meaning";
  onComplete: () => void;
  wordGradeMap: { [key: string]: number };
  setWordGradeMap: React.Dispatch<
    React.SetStateAction<{ [key: string]: number }>
  >;
}

const WordCardReviewer: React.FC<WordCardProps> = ({
  words,
  mode = "word",
  onComplete,
  wordGradeMap,
  setWordGradeMap,
}) => {
  if (words === null || words === undefined) {
    return <div></div>;
  }

  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [direction, setDirection] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const variants: Variants = {
    enter: {
      opacity: 1,
      y: 0,
      x: 0,
      rotate: 0,
    },
    exit: (direction) => {
      const transitions = {
        left: { x: -200, y: 0, rotate: 0 },
        up: { y: -200, x: 0, rotate: 0 },
        right: { x: 200, y: 0, rotate: 0 },
      };
      return {
        ...(transitions[direction as keyof typeof transitions] ||
          transitions.up),
        opacity: 0,
        transition: { duration: 0.25 },
      };
    },
  };

  const handleResponse = async (dir: "left" | "up" | "right") => {
    if (isAnimating) return;

    setIsAnimating(true);
    setDirection(dir);

    await new Promise((resolve) => setTimeout(resolve, 100));

    const grade =
      dir === "left" ? 0 : dir === "up" ? 2.5 : dir === "right" ? 5 : -1;

    setWordGradeMap((prev) => {
      if (!words || !words[currentWordIndex]) return prev; // Ensure words and the current index exist

      const currentWordId = words[currentWordIndex]._id;
      const currentGrade = prev[currentWordId] ?? -1;

      console.log(wordGradeMap);

      const newGrade = currentGrade === -1 ? grade : (currentGrade + grade) / 2;

      return {
        ...prev,
        [currentWordId]: newGrade,
      };
    });

    setCurrentWordIndex((prev) => prev + 1);

    setDirection(null);
    setIsAnimating(false);

    if (currentWordIndex === words.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      onComplete();
    }
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (isAnimating) return;

    const keyActions: Record<string, () => void> = {
      ArrowLeft: () => handleResponse("left"),
      ArrowUp: () => handleResponse("up"),
      ArrowRight: () => handleResponse("right"),
    };

    const action = keyActions[event.key];
    if (action) action();
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isAnimating]);

  return (
    <div className="space-y-8 flex flex-col items-center w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentWordIndex}
          variants={variants}
          initial={{ opacity: 0, y: -20 }}
          animate="enter"
          exit="exit"
          custom={direction}
          className="w-full  aspect-[4/3] bg-white dark:bg-gray-800 rounded-lg shadow-lg flex items-center justify-center relative p-4 "
        >
          <span
            className={`font-semibold text-gray-800 dark:text-gray-100 text-center ${
              (mode === "word" && words[currentWordIndex]?.word?.length > 15) ||
              (mode === "meaning" &&
                words[currentWordIndex]?.meanings[0]?.definitions[0]?.definition
                  ?.length > 50)
                ? "text-3xl"
                : "text-5xl"
            }`}
          >
            {mode === "word" && words[currentWordIndex]?.word}
            {(mode === "meaning" &&
              words[currentWordIndex]?.meanings[0]?.definitions[0]
                ?.definition) ??
              ""}
          </span>
        </motion.div>
      </AnimatePresence>

      {/* Response Buttons */}
      <div className="w-full flex justify-center absolute bottom-16">
        <div className="flex items-center justify-center gap-4 w-full max-w-md mx-auto">
          <motion.button
            onClick={() => handleResponse("left")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 py-3 px-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center gap-2 transition-colors"
            aria-label="No, I don't know the word"
          >
            <ChevronLeft size={20} />
            No
          </motion.button>

          <motion.button
            onClick={() => handleResponse("up")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 py-3 px-6 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full flex items-center justify-center gap-2 transition-colors"
            aria-label="Maybe, I know it a little"
          >
            <ChevronUp size={20} />
            Maybe
          </motion.button>

          <motion.button
            onClick={() => handleResponse("right")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 py-3 px-6 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center gap-2 transition-colors"
            aria-label="Yes, I know the word"
          >
            <ChevronRight size={20} />
            Yes
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default WordCardReviewer;
