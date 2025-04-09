import { query } from "@solidjs/router"
import { useServerSession } from "~/lib/use-server-session";
import { db } from "~/drizzle/db";
import { chat, DrizzleChat, message } from "~/drizzle/schema/chat-schema";
import { eq } from "drizzle-orm";
import { getSignedPdfUrl } from "~/lib/download-from-s3";
import { Message } from "ai";

// server-side query for chats
export const getChats = query(async () => {
  "use server";
  const session = await useServerSession();
  const userId = session.user.id;
  if (userId) {
    const userChats = await db.select().from(chat).where(eq(chat.userId, userId));
    return userChats as DrizzleChat[];
  }
  return [];
}, "chats");

// server-side query for pdfUrl
export const getPdfUrl = query(async (chatId: string) => {
  "use server";
  const currentChat = await db
    .select()
    .from(chat)
    .where(eq(chat.id, parseInt(chatId)))
    .limit(1);

  const signedUrl = await getSignedPdfUrl(currentChat[0].fileKey);
  return signedUrl;
}, "pdfUrl");

// server-side query for past messages
export const getPastMessages = query(async (chatId: string) => {
  "user server";
  const messages = await db
    .select()
    .from(message)
    .where(eq(message.chatId, parseInt(chatId)))

  const validMessages = messages.map((msg) => ({
    id: String(msg.id),
    role: msg.role,
    content: msg.content,
  })) as Message[];

  return validMessages as Message[];
}, "pastMessages");
