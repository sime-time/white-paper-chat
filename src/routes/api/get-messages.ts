import { APIEvent } from "@solidjs/start/server";
import { message } from "~/drizzle/schema/chat-schema";
import { db } from "~/drizzle/db";
import { eq } from "drizzle-orm";

export async function POST(event: APIEvent) {
  try {
    const { chatId } = await event.request.json();
    const messages = await db.select().from(message).where(eq(message.chatId, chatId));
    //console.log("messages:", messages)

    return new Response(JSON.stringify(messages), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Error querying messages from db:", err);
    return new Response(JSON.stringify({
      error: "Failed to query messages from db"
    }), {
      status: 500,
    });
  }
}
