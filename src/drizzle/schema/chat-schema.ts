import { integer, pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const userSystemEnum = pgEnum("user_system_enum", ['system', 'user']);

export const chat = pgTable("chat", {
  id: serial("id").primaryKey(),
  pdfName: text("pdf_name").notNull(),
  pdfUrl: text("pdf_url").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  userId: text("user_id").notNull(),
  fileKey: text("file_key").notNull(), // for retrieving file from s3
});

export const message = pgTable("message", {
  id: serial("id").primaryKey(),
  chatId: integer("chat_id").references(() => chat.id).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  role: userSystemEnum("role").notNull(),
});
