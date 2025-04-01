import { cosineDistance, sql, gt, desc, eq, and } from "drizzle-orm";
import { db } from "~/drizzle/db";
import { segment } from "~/drizzle/schema/chat-schema";
import { generateEmbedding } from "./embeddings";

export async function findSimilarEmbeddings(embeddings: number[], chatId: number) {
  try {
    const similarity = sql<number>`1 - (${cosineDistance(segment.embedding, embeddings)})`
    const result = await db
      .select({ chatId: segment.chatId, content: segment.content, pageNumber: segment.pageNumber, similarity })
      .from(segment)
      .where(and(gt(similarity, 0.6), eq(segment.chatId, chatId)))
      .orderBy((t) => desc(t.similarity))
      .limit(5)

    return result;

  } catch (err) {
    console.error("Error querying embeddings", err);
    throw err;
  }
}

export async function getContext(query: string, chatId: number) {
  console.log("query:", query);
  const queryEmbedding = await generateEmbedding(query);
  const matches = await findSimilarEmbeddings(queryEmbedding, chatId);

  // all the similar segments related to the query
  let context = matches.map(match => (match.content));

  // limit the amount of characters; don't feed too much text into llm
  return context.join("\n").substring(0, 3000);
}
