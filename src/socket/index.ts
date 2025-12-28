import http from "http";
import { Server } from "socket.io";
import { sendMessage } from "./events";
import jwt from "jsonwebtoken";
import { decrypt } from "../services/crypto.service";
import { prisma } from "../db/prisma";

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
      const { token } = socket.handshake.auth;
      console.log("connected", socket.id, "<<<-- New Socket");

      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
          const decryptedData = JSON.parse(decrypt(decoded.data));
          const userId = decryptedData.userId;
          
          await prisma.user.update({
            where: { id: userId },
            data: { socketId: socket.id }
          });
          console.log(`Socket ${socket.id} associated with user ${userId}`);
        } catch (e) {
          console.error("Failed to authenticate socket", e);
        }
      }

      socket.on("sendMessage", (data) => {
        sendMessage(data, socket);
      });

      socket.on("disconnect", async (reason) => {
        // Optionally clear socketId on disconnect
        // But the request says save/update, so updating on connect is enough.
        console.log("disconnect", socket.id, reason);
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
