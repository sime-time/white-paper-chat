import { openai } from "@ai-sdk/openai";
import { APIEvent } from "@solidjs/start/server";
import { streamText } from "ai"
import type { ServerResponse } from "http";
import type { IncomingMessage } from "http";

export async function POST(event: APIEvent) {
  try {
    const { messages } = await event.request.json();

    const result = streamText({
      model: openai("gpt-4o-mini"),
      messages: messages,
    });

    console.log("textStream:", result.toTextStreamResponse());

    return result.toTextStreamResponse();

  } catch (err) {
    console.error("OpenAI API Error:", err);

    return new Response(JSON.stringify({
      error: "Failed to generate response",
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
