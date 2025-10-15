import http from "http";
import { Server } from "socket.io";
import { sendMessage } from "./events";

let io: Server;

const socketSetup = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", async (socket) => {
    try {
      // const { token, idUser, vtx } = socket.handshake.auth;

      socket.on("sendMessage", sendMessage);

      socket.on("disconnect", async (reason) => {
        socket.disconnect(true);
        console.log("disconnect", reason);
      });
    } catch (error) {
      socket.disconnect();
      console.error(error, "XXX From Socket setup");
    }
  });
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io is not initialized!");
  }
  return io;
};

export { socketSetup, getIO };
