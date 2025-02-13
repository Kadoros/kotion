import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Doc } from "@/convex/_generated/dataModel";
import { Volume2 } from "lucide-react";
import React, { useEffect, useState } from "react";

interface SimpleWordCardProps {
  word: Doc<"words">;
  onClick: () => void;
  selectedWord?: Doc<"words"> | null; // Add isSelected property
}

const SimpleWordCard = ({
  word,
  onClick,
  selectedWord,
}: SimpleWordCardProps) => {
  const [isSelected, SetIsSelected] = useState(false);

  useEffect(() => {
    SetIsSelected(selectedWord?._id === word._id);
  }, [word, selectedWord]);

  return (
    <Card
      className={`bg-white dark:bg-[#2A2A2A] border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300 cursor-pointer 
      ${isSelected ? "bg-blue-300 dark:bg-blue-800 hover:bg-blue-200" : "hover:bg-gray-50 dark:hover:bg-gray-800"}`}
      onClick={onClick}
    >
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors group"
          >
            <Volume2 className="h-5 w-5 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
          </Button>
          <div>
            <div className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {word.word}
            </div>
          </div>
        </div>
        <Progress
          value={word.progress }
          className={`w-20 h-2 transition-all duration-300 ${
            isSelected
              ? "bg-blue-500 dark:bg-blue-400"
              : "bg-gray-300 dark:bg-gray-600"
          }`}
        />
      </div>
    </Card>
  );
};

export default SimpleWordCard;

