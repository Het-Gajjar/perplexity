import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages"
import { ChatMistralAI } from "@langchain/mistralai"
import * as z from "zod"
import { tool, createAgent } from "langchain"
import { name } from "ejs";
import { internetSearch } from "./Internet.service.js";






const gemini = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
});

const mistral = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

const internetSearchTool = tool(
  internetSearch,
  {
    name: "internetSearch",
    description: "Search the internet for information",
    schema: z.object({
      query: z.string().describe("The query to search the internet for")
    })

  }

)

const agent = createAgent({
  model: mistral,
  tools: [internetSearchTool],

})





async function generateResponce(messages) {
  const response = await agent.invoke({
    systemMessage: new SystemMessage({
      content: `
      You are a helpful assistant who can answer questions and provide information based on Internet Search.
      `
    }),

    messages: messages.map(message => {
      if (message.role === "user") {
        return new HumanMessage(message.content || "")
      }
      else if (message.role === "ai") {
        return new AIMessage(message.content || "")
      }
      // Fallback if role is missing
      return new HumanMessage(message.content || "")
    })
  });

  return response.messages[response.messages.length - 1].text;
}

async function generateTitle(message) {
  const systemMessage = new SystemMessage({
    content: `
You are an AI that generates short, clear, and meaningful chat titles.

Rules:
- Generate a title based ONLY on the user's first message.
- Keep it under 6 words.
- Make it concise, relevant, and natural.
- Do NOT include quotes, emojis, or punctuation at the end.
- Do NOT explain anything.
- Return ONLY the title, nothing else.
`
  });

  const humanMessage = new HumanMessage(message);

  const response = await mistral.invoke([
    systemMessage,
    humanMessage
  ]);

  return response.content;
}


export default { generateResponce, generateTitle };