import { message } from "~/drizzle/schema/chat-schema";
import { db } from "~/drizzle/db";
import { eq } from "drizzle-orm";
import { query } from "@solidjs/router";
import { Message } from "ai";

export const getMessages = query(async (chatId: number) => {
  "use server";
  try {
    const messages = await db.select().from(message).where(eq(message.chatId, chatId))

    const validMessages = messages.map((msg) => ({
      id: String(msg.id),
      role: msg.role,
      content: msg.content,
    })) as Message[];

    return validMessages as Message[];

  } catch (err) {
    console.error("Error querying messages from db:", err);
    return [];
  }
}, "messages");
