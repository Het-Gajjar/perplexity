import { tavily } from "@tavily/core";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

async function run() {
    try {
        const query = "what is the weather today";
        const result = await tvly.search({ query }, {
            maxResults: 5,
            searchDepth: "advanced",
        });
        console.log(result);
    } catch (e) {
        console.error("ERROR:", e);
    }
}

run();
