import { create } from "zustand";
import { middlewareLocalStorage } from "./middlewareLocalStorage";

export type TRole = "admin" | "manager" | "member";

export interface IUserProfile {
  id: number | null;
  imageUrl?: string;
  username: string | null;
  email: string | null;
  phoneNumber: string | null;
  token: string | null;
  role: TRole | null;
}
const INIT_STATE: IUserProfile = {
  id: null,
  imageUrl: "",
  username: null,
  email: null,
  phoneNumber: null,
  token: null,
  role: null,
};

interface IUserProfileState extends IUserProfile {
  setUser: (user: Partial<IUserProfile>) => void;
  setImage: ({
    imageUrl,
    objectName,
  }: {
    imageUrl: string;
    objectName: string;
  }) => void;
  resetAll: () => void;
}
const middle = middlewareLocalStorage<IUserProfileState>("userProfile");

export const useZUserProfile = create<IUserProfileState>()(
  middle((set) => ({
    ...INIT_STATE,
    setUser: (user) => set((state) => ({ ...state, ...user })),
    setImage: ({ imageUrl, objectName }) =>
      set((state) => ({ ...state, imageUrl, objectName })),
    resetAll: () => set((state) => ({ ...state, ...INIT_STATE })),
  })),
);
