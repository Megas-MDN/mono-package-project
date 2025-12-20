import { Socket } from "socket.io-client";
import { create } from "zustand";
import { IGenericSocket, mockSocket } from "../types/socketType";

export interface IGlobalVar {
  isOpenSideBar: boolean;
  currentSidebarSelected: {
    label: string | null;
    path?: string;
  };
  isOpenModalUserNotActive: boolean;
  idSocket: string;
  loginTime: Date | string | null;
  socketRef: Socket | IGenericSocket;
  search: null | string;
}

const INIT_STATE: IGlobalVar = {
  isOpenSideBar: false,
  currentSidebarSelected: {
    label: null,
  },
  isOpenModalUserNotActive: false,
  idSocket: "",
  loginTime: null,
  socketRef: mockSocket,
  search: null,
};

interface IGlobalVarState extends IGlobalVar {
  setIsOpenSideBar: (isOpenSideBar: boolean) => void;
  setCurrentSidebarSelected: (
    value: IGlobalVar["currentSidebarSelected"],
  ) => void;
  setIsOpenModalUserNotActive: (isOpenModalUserNotActive: boolean) => void;
  setIdSocket: (idSocket: string) => void;
  setLoginTime: (loginTime: Date | string | null) => void;
  setSocketRef: (socketRef: Socket) => void;
  setSearch: (search: string | null) => void;
  resetAll: () => void;
}

export const useZGlobalVar = create<IGlobalVarState>((set) => ({
  ...INIT_STATE,
  setIsOpenSideBar: (isOpenSideBar) =>
    set((state) => ({ ...state, isOpenSideBar })),
  setCurrentSidebarSelected: (currentSidebarSelected) =>
    set((state) => ({ ...state, currentSidebarSelected })),
  setIsOpenModalUserNotActive: (isOpenModalUserNotActive) =>
    set((state) => ({ ...state, isOpenModalUserNotActive })),
  setIdSocket: (idSocket) => set((state) => ({ ...state, idSocket })),
  setLoginTime: (loginTime) => set((state) => ({ ...state, loginTime })),
  setSocketRef: (socketRef) => set((state) => ({ ...state, socketRef })),
  setSearch: (search) => set((state) => ({ ...state, search })),
  resetAll: () => set((state) => ({ ...state, ...INIT_STATE })),
}));
