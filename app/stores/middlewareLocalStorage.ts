import { StateCreator } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const middlewareLocalStorage =
  <T>(name: string) =>
  (f: StateCreator<T>) =>
    persist(f, {
      name,
      storage: createJSONStorage(() => localStorage),
    });
