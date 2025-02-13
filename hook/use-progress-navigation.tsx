import { create } from "zustand";

type ProgressNavigationStore = {
  currentStep: number;
  progress: number;
  totalSteps: number;
  goBack: () => void;
  goForward: () => void;
  setStep: (step: number) => void;
  setTotalSteps: (steps: number) => void;
};

export const useProgressNavigation = create<ProgressNavigationStore>((set, get) => ({
  currentStep: 1,
  progress: 0,
  totalSteps: 5, // Default value, can be modified
  
  goBack: () => {
    set((state) => {
      const newStep = Math.max(state.currentStep - 1, 1);
      return { currentStep: newStep, progress: ((newStep - 1) / Math.max(1, state.totalSteps - 1)) * 100 };
    });
  },
  
  goForward: () => {
    set((state) => {
      const newStep = Math.min(state.currentStep + 1, state.totalSteps);
      return { currentStep: newStep, progress: ((newStep - 1) / Math.max(1, state.totalSteps - 1)) * 100 };
    });
  },
  
  setStep: (step: number) => {
    set((state) => {
      const newStep = Math.min(Math.max(step, 1), state.totalSteps);
      return { currentStep: newStep, progress: ((newStep - 1) / Math.max(1, state.totalSteps - 1)) * 100 };
    });
  },

  setTotalSteps: (steps: number) => {
    set((state) => {
      const newTotal = Math.max(steps, 1);
      const newStep = Math.min(state.currentStep, newTotal);
      return { totalSteps: newTotal, currentStep: newStep, progress: ((newStep - 1) / Math.max(1, newTotal - 1)) * 100 };
    });
  },
}));
