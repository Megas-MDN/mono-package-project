import { Socket } from "socket.io";

export const sendMessage = async (data: unknown, io: Socket) => {
  //io.emit("receiveMessage", data);
  io.broadcast.emit("receiveMessage", data);
};
