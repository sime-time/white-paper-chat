import { db } from "~/drizzle/db";
import { downloadFileToVector } from "./file-to-vector";
import { chat } from "~/drizzle/schema/chat-schema";
import { getS3Url } from "~/lib/download-from-s3";

export async function createChat(fileName: string, fileKey: string, userId: string) {
  "use server";
  if (!userId) {
    throw new Error("Session User ID not found")
  }
  try {
    const chatId = await db.insert(chat).values({
      fileKey: fileKey,
      pdfName: fileName,
      pdfUrl: getS3Url(fileKey),
      userId: userId,
    }).returning({
      insertedId: chat.id,
    });
    console.log("Inserted chat:", chatId[0].insertedId);
    await downloadFileToVector(fileKey, chatId[0].insertedId);
    return chatId[0].insertedId;

  } catch (err) {
    console.error(err);
    return null;
  }
}
