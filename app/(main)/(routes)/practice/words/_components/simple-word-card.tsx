import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Doc } from "@/convex/_generated/dataModel";
import { Volume2 } from "lucide-react";
import React from "react";

interface SimpleWordCardProps {
  word: Doc<"words">;
  
}

const SimpleWordCard = ({ word  }: SimpleWordCardProps) => {
  return (
    <Card  className="bg-white dark:bg-[#2A2A2A] border-gray-200 dark:border-gray-700">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <Volume2 className="h-5 w-5" />
          </Button>
          <div>
            <div className="text-lg font-medium">{word.word}</div>
            {/* <div className="text-sm text-gray-500 dark:text-gray-400">
              {word.phonetic}
            </div> */}
          </div>
        </div>
        <div className="w-2 h-2 rounded-full bg-red-500" />
      </div>
    </Card>
  );
};

export default SimpleWordCard;
