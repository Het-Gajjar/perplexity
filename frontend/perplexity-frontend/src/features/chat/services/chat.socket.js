import { io } from "socket.io-client";


export async function initializeSocket() {
    const socket = io("https://querynova-ai.onrender.com", {
        withCredentials: true,
    });


    socket.on("connect", () => {
        console.log("socket connected", socket.id);
    })

}

