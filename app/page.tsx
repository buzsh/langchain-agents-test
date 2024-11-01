"use client";

import { useState } from "react";

interface ToolCallResult {
  query?: string;
  depth?: number;
  content?: string;
  style?: "formal" | "casual" | "technical";
  wordCount?: number;
}

export default function Home() {
  const [task, setTask] = useState("");
  const [result, setResult] = useState<ToolCallResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (agentType: "researcher" | "writer") => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ task, agentType }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.details || "Failed to process request");
      }
      
      setResult(data.result);
    } catch (error) {
      console.error(error);
      setError((error as Error).message);
      setResult(null);
    }
    setLoading(false);
  };

  const renderResult = () => {
    if (!result) return null;

    if ('query' in result) {
      return (
        <>
          <p><strong>Query:</strong> {result.query}</p>
          <p><strong>Research Depth:</strong> {result.depth}</p>
        </>
      );
    }

    if ('content' in result) {
      return (
        <>
          <p><strong>Content:</strong> {result.content}</p>
          <p><strong>Style:</strong> {result.style}</p>
          <p><strong>Word Count:</strong> {result.wordCount}</p>
        </>
      );
    }
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Multi-Agent System</h1>
      
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Usage Instructions:</h2>
        <ul className="list-disc pl-5">
          <li>For Researcher: Simply enter a topic to research (e.g., &ldquo;Research quantum computing&rdquo;)</li>
          <li>For Writer: Specify content, style, and word count (e.g., &ldquo;Write a technical blog post about AI in 500 words&rdquo;)</li>
        </ul>
      </div>
      
      <textarea
        className="w-full p-2 border rounded mb-4 bg-inherit dark:text-white"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Enter your task..."
        rows={4}
      />
      
      <div className="flex gap-4 mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={() => handleSubmit("researcher")}
          disabled={loading}
        >
          Ask Researcher
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={() => handleSubmit("writer")}
          disabled={loading}
        >
          Ask Writer
        </button>
      </div>

      {loading && (
        <div className="mt-4 p-4 border rounded bg-gray-50 dark:bg-gray-800">
          <p className="text-gray-600 dark:text-gray-300">Processing request...</p>
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-4 border rounded bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300">
          <h2 className="font-bold mb-2">Error:</h2>
          <p>{error}</p>
        </div>
      )}
      
      {result && (
        <div className="mt-4 p-4 border rounded">
          <h2 className="font-bold mb-2">Agent Response:</h2>
          {renderResult()}
        </div>
      )}
    </main>
  );
} 
