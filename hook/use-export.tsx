import { create } from "zustand";

type ExportStore = {
  isOpen: boolean;

  onOpen: () => void;
  onClose: () => void;
};

export const useExport = create<ExportStore>((set) => ({
  isOpen: false,

  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
