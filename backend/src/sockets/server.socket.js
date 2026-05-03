import { Server } from "socket.io";

let io;

export function initsocket(httpserver) {
    io = new Server(httpserver, {
        cors: {
            origin: true, // ✅ allow all Vercel + localhost
            credentials: true,
        },
    });

    console.log("Socket server is running");

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
}

export function getIO() {
    if (!io) {
        throw new Error("Socket not initialized");
    }
    return io;
}