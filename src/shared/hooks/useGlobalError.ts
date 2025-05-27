import { create } from 'zustand';

interface GlobalErrorState {
  error: string | null;
  setError: (msg: string | null) => void;
}

export const useGlobalError = create<GlobalErrorState>(set => ({
  error: null,
  setError: msg => set({ error: msg }),
}));
