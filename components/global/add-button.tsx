import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { DictionaryEntry } from "@/types";
import { useMutation } from "convex/react";
import { PlusCircle, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface PlusIconButtonProps {
  className?: string;
  dictionaryEntry: DictionaryEntry | null;
  wordListId: Id<"wordLists"> | null; // Accept wordListId as a prop
}

const PlusIconButton: React.FC<PlusIconButtonProps> = ({
  className = "",
  dictionaryEntry,
  wordListId,
}) => {
  const [clicked, setClicked] = useState(false);
  const addWord = useMutation(api.words.addWord);

  const onAddWord = async () => {
    if (clicked || !dictionaryEntry || !wordListId) return; // Prevent duplicate additions or missing wordListId

    const cleanedPhonetics = dictionaryEntry.phonetics.map((phonetic) => {
      const { license, sourceUrl, ...cleanedPhonetic } = phonetic; // Remove license and sourceUrl
      return cleanedPhonetic;
    });

    const promise = addWord({
      word: dictionaryEntry.word,
      phonetic: dictionaryEntry.phonetic || "",
      phonetics: cleanedPhonetics,
      meanings: dictionaryEntry.meanings || [],
      wordListId,
    });

    toast.promise(promise, {
      loading: "Adding this word to your word list...",
      success: "This word has been added to your word list!",
      error: "Failed to add this word",
    });

    setClicked(!clicked);
  };

  return (
    <div
      role="button"
      className={`cursor-pointer ${className}`}
      onClick={onAddWord}
    >
      {clicked ? (
        <Check className="transition-all duration-300 ease-in-out text-green-500" />
      ) : (
        <PlusCircle className="transition-all duration-300 ease-in-out hover:scale-125" />
      )}
    </div>
  );
};

export default PlusIconButton;