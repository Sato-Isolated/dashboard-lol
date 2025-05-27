import { create } from 'zustand';

interface UserState {
  region: string;
  tagline: string;
  summonerName: string;
  setUser: (user: {
    region: string;
    tagline: string;
    summonerName: string;
  }) => void;
}

export const useUserStore = create<UserState>(set => ({
  region: '',
  tagline: '',
  summonerName: '',
  setUser: user => set(user),
}));
