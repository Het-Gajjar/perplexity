import { Server } from "socket.io";


let io;
export function initsocket(httpserver) {
    io = new Server(httpserver, {
        cors: {
            origin: "http://localhost:5174",
            credentials: true,
        },
    });

    console.log("Socket server is running");

    io.on("connection", (socket) => {
        console.log("User connected", socket.id);
    })
}

export function getIO() {
    if (!io) {
        throw new Error("Socket not initialized");
    }
    return io;
}