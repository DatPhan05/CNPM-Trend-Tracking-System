import { Server, Socket } from "socket.io";
import { Server as HTTPServer } from "http";

let io: Server;

export const initSocketIO = (httpServer: HTTPServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join user-specific room for personalized notifications
    socket.on("join-user-room", (userId: string) => {
      socket.join(`user-${userId}`);
      console.log(`User ${userId} joined room: user-${userId}`);
    });

    // Leave room when disconnecting
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.IO not initialized!");
  }
  return io;
};

export const notifyUserPaperUpdate = (userId: string, data: any) => {
  io.to(`user-${userId}`).emit("paper-update", data);
};

export const notifyAllUsers = (event: string, data: any) => {
  io.emit(event, data);
};