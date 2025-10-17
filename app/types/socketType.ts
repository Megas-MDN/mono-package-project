export interface IGenericSocket {
  disconnect: () => void;
  on: (event: string, callback: (data: unknown) => void) => void;
  emit: (event: string, data?: unknown) => void;
  off: (event: string, callback?: (data: unknown) => void) => void;
  id: string;
  connected: boolean;
}

export const mockSocket: IGenericSocket = {
  disconnect: () => {},
  on: () => {},
  emit: () => {},
  off: () => {},
  id: "",
  connected: false,
};
