import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { user } from "./schema/auth-schema";
import { User } from "better-auth";
import { eq } from "drizzle-orm";

if (!process.env.DATABASE_URL) {
  throw new Error("database url not found");
}

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });

export async function getAllUsers() {
  "use server";
  const users: User[] | null = await db.select().from(user);
  return users;
}

export async function getUser(id: string) {
  "use server";
  const singleUser = await db.select().from(user).where(eq(user.id, id));
  return singleUser
}
