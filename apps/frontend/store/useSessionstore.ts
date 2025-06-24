// store/useSessionStore.ts
import { create } from "zustand";

type SessionStore = {
  isSessionStarted: boolean;
  setSessionStarted: (started: boolean) => void;
};

export const useSessionStore = create<SessionStore>((set) => ({
  isSessionStarted: false,
  setSessionStarted: (started) => set({ isSessionStarted: started }),
}));
