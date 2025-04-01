import { integer, pgEnum, pgTable, serial, text, timestamp, vector, index } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const userSystemEnum = pgEnum("user_system_enum", ['system', 'user']);

export const chat = pgTable("chat", {
  id: serial("id").primaryKey(),
  pdfName: text("pdf_name").notNull(),
  pdfUrl: text("pdf_url").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  userId: text("user_id").references(() => user.id).notNull(),
  fileKey: text("file_key").notNull(), // for retrieving file from s3
});
export type DrizzleChat = typeof chat.$inferSelect;

export const message = pgTable("message", {
  id: serial("id").primaryKey(),
  chatId: integer("chat_id").references(() => chat.id).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  role: userSystemEnum("role").notNull(),
});

export const segment = pgTable("segment", {
  id: text("id").primaryKey(),
  chatId: integer("chat_id").references(() => chat.id),
  content: text("content").notNull(),
  embedding: vector("embedding", { dimensions: 1536 }).notNull(),
  pageNumber: integer("page_number"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => [
  index("embeddingIndex").using("hnsw", table.embedding.op("vector_cosine_ops")),
]);
export type DrizzleSegment = typeof segment.$inferSelect;
