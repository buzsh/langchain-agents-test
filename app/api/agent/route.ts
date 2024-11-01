import { researchAgent, writerAgent } from "@/utils/agents";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { task, agentType } = await request.json();

    let result;
    if (agentType === "researcher") {
      const response = await researchAgent.invoke(task);
      result = response.tool_calls?.[0]?.args;
      
      if (!result) {
        throw new Error("No research results generated");
      }
    } else if (agentType === "writer") {
      const writerPrompt = `Please write content with the following details: ${task}. 
        Include a specific style (formal, casual, or technical) and target word count.`;
      
      const response = await writerAgent.invoke(writerPrompt);
      result = response.tool_calls?.[0]?.args;
      
      if (!result) {
        throw new Error("No writing results generated");
      }
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Agent error:", error);
    return NextResponse.json(
      { error: "Error processing request", details: (error as Error).message },
      { status: 500 }
    );
  }
} 
