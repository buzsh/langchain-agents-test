import { ChatOpenAI } from "@langchain/openai";

export const chatModel = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0.7,
  modelName: "gpt-4-turbo-preview",
});
