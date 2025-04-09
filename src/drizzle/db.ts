import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
/*
if (typeof window !== "undefined") {
  console.error("This module can only be used on the server.");
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set.");
} else {
  console.log("db url:", process.env.DATABASE_URL!);
}
*/
const sql = neon(process.env.DATABASE_URL! || import.meta.env.VITE_DATABASE_URL);
export const db = drizzle(sql);
