import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
import { maskEverySecondChar } from "../common/helpers.js";

// [server]
// Load environment variables from .env.development.local for local development.
dotenv.config({ path: ".env.development.local" });

console.log(
  `(2) NODE_ENV: ${maskEverySecondChar(process.env.COUNT_ANYTHING_DB_DATABASE_URL ?? "")}`,
);

export const sql = neon(process.env.COUNT_ANYTHING_DB_DATABASE_URL ?? "");
