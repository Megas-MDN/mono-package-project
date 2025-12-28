import "dotenv/config";
import { app } from "./app";
import { socketSetup, getIO } from "./socket";
import http from "http";

const port = process.env.PORT || 3001;
const server = http.createServer(app);
socketSetup(server);
server.listen(port, () =>
  console.log(
    `Server started on port %s 🚀 \n${new Date()}\n${"=".repeat(50)}`,
    port,
  ),
);

export { getIO };
