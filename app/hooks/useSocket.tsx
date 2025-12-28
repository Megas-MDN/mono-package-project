import { useEffect, useRef } from "react";
import socket, { Socket } from "socket.io-client";
import { type IGenericSocket, mockSocket } from "../types/socketType";
import { useZGlobalVar } from "../stores/useZGlobalVar";
import { useZUserProfile } from "../stores/useZUserProfile";
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export const useSocket = () => {
  const { setIdSocket, setSocketRef } = useZGlobalVar();
  const { id: idUser, token } = useZUserProfile();

  const socketRef = useRef<Socket | IGenericSocket>(
    mockSocket,
  ) as React.RefObject<Socket | IGenericSocket>;

  useEffect(() => {
    if (idUser && token) {
    socketRef.current = socket(SOCKET_URL, {
      query: {},
      auth: { token, idUser },
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 3000,
      reconnectionAttempts: 3,
      path: "",
    });

    setIdSocket(socketRef.current.id as string);

    socketRef.current.on("connect", () => {
      setIdSocket(socketRef.current.id as string);
      setSocketRef(socketRef.current as Socket);
    });
    }

    socketRef.current.on("disconnect", () => {
      socketRef.current = mockSocket;
      setIdSocket("");
    });

    return () => {
      socketRef.current.off("connect");
      socketRef.current.off("disconnect");

      if (socketRef.current.connected) {
        socketRef.current.disconnect();
      }
      socketRef.current = mockSocket;
      setIdSocket("");
    };
  }, [idUser, token]);

  const sendMessage = (body: unknown) => {
    socketRef.current.emit("sendMessage", body);
  };

  return { sendMessage };
};
