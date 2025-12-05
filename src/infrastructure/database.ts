import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

// [server]
// Load environment variables from .env.development.local for local development.
dotenv.config({ path: ".env.development.local" });

if (!process.env.COUNT_ANYTHING_DB_DATABASE_URL) {
  throw new Error("Missing COUNT_ANYTHING_DB_DATABASE_URL");
}

export const sql = neon(process.env.COUNT_ANYTHING_DB_DATABASE_URL);
