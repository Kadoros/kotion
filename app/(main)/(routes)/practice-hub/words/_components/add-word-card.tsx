import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Doc } from "@/convex/_generated/dataModel";

const AddWordCard = ({ wordList }: { wordList: Doc<"wordLists"> | null }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [word, setWord] = useState("");
  const [phonetic, setPhonetic] = useState("");
  const [pastedWords, setPastedWords] = useState<
    { word: string; meaning: string }[]
  >([]);

  const [meaning, setMeaning] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);
  const wordInputRef = useRef<HTMLInputElement>(null); // Reference for the word input
  const addWord = useMutation(api.words.addWord);

  // Handle card click
  const handleCardClick = () => {
    if (!wordList) {
      toast.error("Please select a word list before adding words.");
      return;
    }
    setIsClicked(true);
  };

  // Handle blur (when click is outside card)
  const handleClickOutside = (event: MouseEvent) => {
    if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
      setIsClicked(false);
      setPastedWords([]);
    }
  };

  // Use effect to add event listener for clicks outside
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");

    // Split the text into lines and filter out empty lines
    const lines = pastedText.split("\n").filter((line) => line.trim());

    const parsedWords: { word: string; meaning: string }[] = [];

    // Process pairs of lines (word and meaning)
    for (let i = 0; i < lines.length; i += 2) {
      // Check if we have both a word and its meaning
      if (i + 1 < lines.length) {
        const word = lines[i].trim();
        const meanings = lines[i + 1].split(",").map((m) => m.trim());

        // Join multiple meanings with commas and remove duplicates
        const uniqueMeanings = Array.from(new Set(meanings));
        const meaning = uniqueMeanings.join(", ");

        parsedWords.push({ word, meaning });
      }
    }

    setPastedWords((prev) => [...prev, ...parsedWords]);

    // Clear the input fields since we're handling the paste in the preview section
    setWord("");
    setMeaning("");
  };
  // Handle form submission
  const handleSubmitAll = async () => {
    if (pastedWords.length === 0 && (!word || !meaning)) return;

    const wordsToSubmit = [...pastedWords];
    if (word && meaning) {
      wordsToSubmit.push({ word, meaning });
    }

    const promises = wordsToSubmit.map(({ word, meaning }) =>
      addWord({
        word,
        phonetic: "",
        phonetics: [],
        meanings: [
          {
            definitions: [
              {
                definition: meaning,
                synonyms: [],
                antonyms: [],
              },
            ],
            synonyms: [],
            antonyms: [],
          },
        ],
        wordListId: wordList?._id,
      })
    );

    toast.promise(Promise.all(promises), {
      loading: "Adding words...",
      success: "Words added successfully!",
      error: "Failed to add words.",
    });

    setPastedWords([]);
    setWord("");
    setMeaning("");
    setIsClicked(false);
  };

  // Handle Enter key to submit
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmitAll();
    }
  };

  return (
    <Card
      ref={cardRef}
      className=" border-gray-200 dark:border-gray-700 shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
      onClick={handleCardClick}
    >
      <div className="p-4 flex items-center justify-center">
        <div className="flex items-center justify-center space-x-4 min-h-10">
          {isClicked ? (
            <div className="flex flex-col">
              <div className="flex space space-x-2">
                <Input
                  ref={wordInputRef} // Assign the ref to the word input
                  type="text"
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                  placeholder="Word"
                  className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-[#333] focus:ring-2 focus:ring-blue-500"
                  onKeyDown={handleKeyDown}
                  onPaste={handlePaste} // Handle paste event
                />

                <Input
                  type="text"
                  value={meaning}
                  onChange={(e) => setMeaning(e.target.value)}
                  placeholder="Meaning"
                  className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-[#333] focus:ring-2 focus:ring-blue-500"
                  onKeyDown={handleKeyDown}
                />
              </div>
              {pastedWords.length > 0 && (
                <div className="border-t pt-2">
                  <h3 className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                    Confirm Words:
                  </h3>
                  <ul className="max-h-40 overflow-y-auto">
                    {pastedWords.map((entry, index) => (
                      <li
                        key={index}
                        className="flex justify-between p-1 border-b"
                      >
                        <span className="text-gray-800 dark:text-gray-200">
                          {entry.word}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                          {entry.meaning}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Button onClick={handleSubmitAll} className="mt-2 w-full">
                    Confirm & Add Words
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div>
              <Plus className="h-5 w-5 text-gray-500 group-hover:text-blue-500 dark:text-gray-400 dark:group-hover:text-blue-400 transition-colors" />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default AddWordCard;
