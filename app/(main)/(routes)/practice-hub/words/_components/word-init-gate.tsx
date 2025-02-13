import { useEffect, useState } from "react";
import { Doc } from "@/convex/_generated/dataModel";
import WordMemorizingIntroduction from "./word-init-page";

interface WordInitGateProps {
  wordLists: Doc<"wordLists">[] | undefined;
  children: React.ReactNode;
}

const WordInitGate = ({ wordLists, children }: WordInitGateProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (wordLists !== undefined) {
      setIsLoading(false);
    }
  }, [wordLists]);

  if (isLoading) {
    return null; // Prevent flicker by not rendering anything at first
  }

  if (wordLists !== undefined && wordLists?.length === 0) {
    return <WordMemorizingIntroduction />;
  }

  return <>{children}</>;
};

export default WordInitGate;
