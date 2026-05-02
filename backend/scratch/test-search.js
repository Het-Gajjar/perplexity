import AiService from "../src/services/Ai.service.js";
import dotenv from "dotenv";

dotenv.config();

async function test() {
    try {
        console.log("Testing AI response with search...");
        const messages = [
            { role: "user", content: "What is the current price of Bitcoin?" }
        ];
        
        const response = await AiService.generateResponce(messages);
        console.log("AI Response:", response);
    } catch (error) {
        console.error("Test failed:", error);
    }
}

test();
