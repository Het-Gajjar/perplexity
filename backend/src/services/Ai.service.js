import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages"
import { ChatMistralAI } from "@langchain/mistralai"
import * as z from "zod"
import { tool, createAgent } from "langchain"
import { internetSearch } from "./Internet.service.js";






const gemini = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
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
    description: "Search the internet for real-time, current, or recent information. MUST be used for: current date/time, latest news, live prices, weather, recent events, or anything that may have changed after training.",
    schema: z.object({
      query: z.string().describe("The query to search the internet for")
    })
  }
)

const SYSTEM_PROMPT = `You are an AI assistant with access to an internetSearch tool.

MANDATORY RULE:

1. For EVERY user query:
   → You MUST call the internetSearch tool first.

2. Do NOT answer any question from your internal knowledge.
   - Even for simple or known questions
   - Always rely on the tool

3. Workflow:
   - Step 1: Call internetSearch with a relevant query
   - Step 2: Analyze the tool result
   - Step 3: Generate the final answer ONLY using the tool result

4. Never skip the tool call.
5. Never guess or hallucinate information.
6. Never answer directly without tool usage.

7. If the tool fails or returns empty:
   - Clearly say: "I couldn't fetch real-time data. Please try again."

Your goal is to always provide answers based on real-time internet data using the internetSearch tool only.`;

const agent = createAgent({
  model: mistral,
  tools: [internetSearchTool],
  systemPrompt: SYSTEM_PROMPT,
});





async function generateResponce(messages, imageBase64 = null, mimetype = null) {

  const history = messages.slice(0, -1).map(msg => {
    const textContent = Array.isArray(msg.content)
      ? msg.content.map(c => c.text).join("")
      : msg.content;
    
    return msg.role === "user"
      ? new HumanMessage(textContent)
      : new AIMessage(textContent);
  });

  const lastMsg = messages[messages.length - 1];
  const lastMsgText = Array.isArray(lastMsg.content)
    ? lastMsg.content.map(c => c.text).join("")
    : lastMsg.content;

  let lastContent = [{ type: "text", text: lastMsgText }];
  if (imageBase64) {
    lastContent.push({
      type: "image_url",
      image_url: `data:${mimetype};base64,${imageBase64}`,
    });
  }

  const response = await agent.invoke({
    messages: [
      ...history,
      new HumanMessage({ content: lastContent }),
    ],
  });
  return response.messages[response.messages.length - 1].content;
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