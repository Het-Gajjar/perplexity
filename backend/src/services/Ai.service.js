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
  model: gemini,
  tools: [internetSearchTool],

})





async function generateResponce(messages, imageBase64 = null, mimetype = null) {

  const history = messages.slice(0, -1).map(msg =>
    msg.role === "user"
      ? new HumanMessage(msg.content)
      : new AIMessage(msg.content)
  );

  const lastMsg = messages[messages.length - 1];
  let lastContent = [{ type: "text", text: lastMsg.content }];
  if (imageBase64) {
    lastContent.push({
      type: "image_url",
      image_url: `data:${mimetype};base64,${imageBase64}`,
    });
  }

  const response = await gemini.invoke([   // Use gemini (vision), not mistral agent
    ...history,
    new HumanMessage({ content: lastContent }),
  ]);
  return response.content;
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