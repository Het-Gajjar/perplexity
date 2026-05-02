import { tavily } from "@tavily/core";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.TAVILY_API_KEY) {
    throw new Error("TAVILY_API_KEY is missing");
}

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

export async function internetSearch({ query }) {
    try {
        const result = await tvly.search(query, {
            maxResults: 5,
            searchDepth: "advanced",
        });

        return result; // ✅ return object, NOT string
    } catch (error) {
        console.error("Tavily Error:", error);
        throw error;
    }
}