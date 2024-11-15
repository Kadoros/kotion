import { create } from "zustand";

type ExportCtxStore = {
  exportData: string | null;
  setExportData: (data: string | null) => void;
};

export const useExportCtx = create<ExportCtxStore>((set) => ({
  exportData: null,
  setExportData: (data) => set({ exportData: data }),
}));
