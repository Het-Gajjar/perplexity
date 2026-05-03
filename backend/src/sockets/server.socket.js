import { Server } from "socket.io";


let io;
export function initsocket(httpserver) {
    io = new Server(httpserver, {
        cors: {
            origin: "https://query-nova-ai.vercel.app/",
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