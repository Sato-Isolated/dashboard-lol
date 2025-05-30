import { create } from 'zustand';

interface GlobalLoadingState {
  loading: boolean;
  setLoading: (v: boolean) => void;
}

export const useGlobalLoading = create<GlobalLoadingState>(set => ({
  loading: false,
  setLoading: v => set({ loading: v }),
}));
