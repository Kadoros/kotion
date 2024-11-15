// hooks/usePDFHighlight.ts
import { create } from "zustand";
import { SelectionData } from "@react-pdf-viewer/highlight";

interface PDFHighlightState {
  selectedText?: string | null;
  setSelectedText: (text?: string | null) => void;
}

export const usePDFHighlight = create<PDFHighlightState>((set) => ({
  selectedText: null,
  setSelectedText: (text) => set({ selectedText: text }),
}));
