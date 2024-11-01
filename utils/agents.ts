import { ChatOpenAI } from "@langchain/openai";
import { tool } from "@langchain/core/tools";
import { z } from "zod";

// Initialize the chat model
const chatModel = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0.7,
  modelName: "gpt-4-turbo-preview",
});

// Define schemas for our tools
const researchSchema = z.object({
  query: z.string().describe("The topic to research"),
  depth: z.number()
    .min(1)
    .max(5)
    .describe("How deep to go in the research (1-5)"),
});

const writingSchema = z.object({
  content: z.string().describe("The content to write"),
  style: z.enum(["formal", "casual", "technical"])
    .describe("The writing style to use"),
  wordCount: z.number()
    .describe("Target word count for the content"),
});

// Create tools using the new tool function
const researchTool = tool(
  async ({ query, depth }) => {
    // Implement actual research logic here
    return `Research results for "${query}" at depth ${depth}`;
  },
  {
    name: "research",
    description: "Searches and summarizes information about a given topic",
    schema: researchSchema,
  }
);

const writingTool = tool(
  async ({ content, style, wordCount }) => {
    // Implement actual writing logic here
    return `Generated ${wordCount} words in ${style} style about: ${content}`;
  },
  {
    name: "writer",
    description: "Writes content based on given parameters",
    schema: writingSchema,
  }
);

// Create specialized models with bound tools
export const researchAgent = chatModel.bindTools([researchTool]);
export const writerAgent = chatModel.bindTools([writingTool]);
