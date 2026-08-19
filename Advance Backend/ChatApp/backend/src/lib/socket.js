import { Server } from "socket.io";

const onlineUsers = new Map();
let io;

export const initSocketServer = (server) => {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:5174"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      onlineUsers.set(userId, socket.id);
    }

    io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));

    socket.on("disconnect", () => {
      onlineUsers.delete(userId);
      io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
    });
  });

  return io;
};

export const getReceiverSocketId = (receiverId) => onlineUsers.get(receiverId);

export const getIO = () => io;