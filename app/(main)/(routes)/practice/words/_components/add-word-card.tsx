import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import React from "react";

const AddWordCard = () => {
  return (
    <Card className="bg-white dark:bg-[#2A2A2A] border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:bg-gray-50 dark:hover:bg-gray-800">
      <div className="p-4 flex items-center justify-center">
        <div className="flex items-center justify-center space-x-4 h-10">
          <div>
            <Plus className="h-5 w-5 text-gray-500 group-hover:text-blue-500 dark:text-gray-400 dark:group-hover:text-blue-400 transition-colors" />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AddWordCard;
