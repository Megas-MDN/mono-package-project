import { Server } from "socket.io";

export const sendMessage = async (data: unknown, io: Server) => {
  io.emit("receiveMessage", data);
};
