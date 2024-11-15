"use client";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import {
  BlockNoteEditor,
  filterSuggestionItems,
  PartialBlock,
} from "@blocknote/core";
import {
  DefaultReactSuggestionItem,
  getDefaultReactSlashMenuItems,
  SuggestionMenuController,
  useCreateBlockNote,
} from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { useTheme } from "next-themes";
import { useEdgeStore } from "@/lib/edgestore";
import { useExport } from "@/hook/use-export";
import { ExportModal } from "@/components/modals/export-modal";
import { Navbar } from "@/components/Editor/navbar";
import { ImportModal } from "@/components/modals/import-modal";
import {
  Bot,
  MessageCircleQuestion,
  PanelRightOpen,
  SquarePen,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Logo from "@/app/(marketing)/_components/logo";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

function CustomSlashMenu({ position }: { position: { x: number; y: number } }) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div
      className="absolute border border-black bg-slate-100 h-12 w-1/3"
      style={{
        top: position.x,
        left: position.y,
      }}
    >
      <input ref={inputRef} className="h-full w-full p-3 bg-slate-100" />
    </div>
  );
}

const Editor = ({ onChange, initialContent, editable }: EditorProps) => {
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();
  const [showCustomMenu, setShowCustomMenu] = useState(true);

  const hasMounted = useRef(false); // Track initial mount
  const editorRef = useRef<HTMLDivElement>(null);
  const [caretPosition, setCaretPosition] = useState({ x: 0, y: 0 });

  

  const handleUpload = async (file: File) => {
    const res = await edgestore.publicFiles.upload({ file });
    return res.url;
  };

  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent: initialContent
      ? (JSON.parse(initialContent) as PartialBlock[])
      : undefined,
    defaultStyles: true,
    animations: true,
    trailingBlock: false,
    uploadFile: handleUpload,
  });

  const aiItem = (editor: BlockNoteEditor) => ({
    title: "AI",
    onItemClick: () => {},
    aliases: ["ai", "aa"],
    group: "Other",
    icon: <Bot size={18} />,
    subtext: "Used to generate anything based on the note.",
  });
  const generateSummaryItem = () => ({
    title: "Generate Summar",
    onItemClick: () => {},
    aliases: ["ais", "as"],
    group: "Other",
    icon: <SquarePen size={18} />,
    subtext: "Summarizes the current note content.",
  });
  const generateQuestionItem = () => ({
    title: "Generate Questions",
    onItemClick: () => {},
    aliases: ["aiq", "aq"],
    group: "Other",
    icon: <MessageCircleQuestion size={18} />,
    subtext: "Creates questions based on the note content.",
  });
  const openAiPanelItem = () => ({
    title: "open AI Panel",
    onItemClick: () => {},
    aliases: ["aie", "ae"],
    group: "Other",
    icon: <PanelRightOpen size={18} />,
    subtext: "open AI Panel",
  });

  const getCustomSlashMenuItems = (
    editor: BlockNoteEditor
  ): DefaultReactSuggestionItem[] => [
    ...getDefaultReactSlashMenuItems(editor),
    aiItem(editor),
    generateSummaryItem(),
    generateQuestionItem(),
    openAiPanelItem(),
  ];

  const onExport = async (format: string) => {
    if (format === "pdf") {
      return "pdf";
    } else if (format === "md") {
      return await editor.blocksToMarkdownLossy(editor.document);
    } else if (format === "html") {
      return await editor.blocksToHTMLLossy(editor.document);
    } else {
      throw new Error("Unsupported format");
    }
  };

  const onImport = async (data: string, format: string): Promise<void> => {
    if (format === "md") {
      const blocks = await editor.tryParseMarkdownToBlocks(data);
      editor.replaceBlocks(editor.document, blocks);
    } else if (format === "html") {
      const blocks = await editor.tryParseHTMLToBlocks(data);
      editor.replaceBlocks(editor.document, blocks);
    } else {
      console.error("Unsupported format");
    }
  };

  useEffect(() => {
    hasMounted.current = true; // Set to true after first render
  }, []);

  return (
    <div ref={editorRef} className="relative">
      {/* <div>
        Caret Position - X: {caretPosition.x}, Y: {caretPosition.y}
      </div> */}
      <BlockNoteView
        editor={editor}
        editable={editable}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        slashMenu={false}
        onChange={() => {
          if (hasMounted.current) {
            const documentContent = JSON.stringify(editor.document);
            onChange(documentContent);
          }
        }}
      >
        <SuggestionMenuController
          triggerCharacter={"/"}
          getItems={async (query) =>
            filterSuggestionItems(getCustomSlashMenuItems(editor), query)
          }
        />
      </BlockNoteView>
      {/* {showCustomMenu && <CustomSlashMenu position={caretPosition} />} */}
      <ImportModal onImport={onImport} />
      <ExportModal onExport={onExport} />
    </div>
  );
};

export default Editor;
