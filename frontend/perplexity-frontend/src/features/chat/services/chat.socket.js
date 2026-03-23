import { io } from "socket.io-client";


export async function initializeSocket() {
    const socket = io("http://localhost:3000", {
        withCredentials: true,
    });


    socket.on("connect", () => {
        console.log("socket connected", socket.id);
    })

}

