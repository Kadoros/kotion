import { create } from "zustand";

type OpenPdfWithStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useOpenPdfWith = create<OpenPdfWithStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
