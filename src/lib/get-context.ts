"use server";
import { db } from "~/drizzle/db";
import { cosineDistance, sql, eq, and, gt, desc } from "drizzle-orm";
import { segment } from "~/drizzle/schema/chat-schema";
import { generateEmbedding } from "./embeddings";

export async function getSimilarEmbeddings(embeddings: number[], chatId: number) {
  try {
    const similarity = sql<number>`1 - (${cosineDistance(segment.embedding, embeddings)})`;
    const result = await db
      .select({ chatId: segment.chatId, content: segment.content, pageNumber: segment.pageNumber, similarity })
      .from(segment)
      .where(and(gt(similarity, 0.6), eq(segment.chatId, chatId)))
      .orderBy((t) => desc(t.similarity))
      .limit(5);

    return result;

  } catch (err) {
    console.error("Error querying embeddings:", err);
    throw err;
  }
}

export async function getContext(query: string, chatId: number) {
  const queryEmbedding = await generateEmbedding(query);
  const matches = await getSimilarEmbeddings(queryEmbedding, chatId);
  console.log("query:", query);

  // relevant context based on the most similar segments
  let context = matches.map((match) => match.content);

  // limit the amount of tokens passed to the llm
  return context.join("\n").substring(0, 3000);
}
