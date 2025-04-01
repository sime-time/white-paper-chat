import { openai } from "@ai-sdk/openai";
import { APIEvent } from "@solidjs/start/server";
import { Message, streamText } from "ai"
import { db } from "~/drizzle/db";
import { eq } from "drizzle-orm";
import { chat } from "~/drizzle/schema/chat-schema";
import { getContext } from "~/lib/get-context";

export async function POST(event: APIEvent) {
  try {
    const { messages, chatId } = await event.request.json();

    const chats = await db.select().from(chat).where(eq(chat.id, chatId));
    if (chats.length != 1) {
      return new Response(JSON.stringify({ error: "Chat not found" }), { status: 404 });
    }

    const lastMessage = messages[messages.length - 1];
    const context = await getContext(lastMessage.content, parseInt(chatId));

    const prompt = {
      role: "system",
      content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
      The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
      AI is a well-behaved and well-mannered individual.
      AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
      AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
      AI assistant is a big fan of Pinecone and Vercel.
      <CONTEXT BLOCK>
      ${context}
      </CONTEXT BLOCK>
      AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
      If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
      AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
      AI assistant will not invent anything that is not drawn directly from the context.
      `,
    };

    const result = streamText({
      model: openai("gpt-4o-mini"),
      messages: [
        prompt,
        ...messages.filter((message: Message) => message.role === "user"), // save some token space by only using user messages
      ],
    });

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
