import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
import { PrismaClient } from '../generated/prisma/client.js'
import { PrismaNeon } from '@prisma/adapter-neon'

// [server]
// Load environment variables from .env.development.local for local development.
dotenv.config({ path: ".env.development.local" });

if (!process.env.COUNT_ANYTHING_DB_DATABASE_URL) {
  throw new Error("Missing COUNT_ANYTHING_DB_DATABASE_URL");
}

const adapter = new PrismaNeon({
  connectionString: process.env.COUNT_ANYTHING_DB_DATABASE_URL!,
})

export const sql = neon(process.env.COUNT_ANYTHING_DB_DATABASE_URL);

/**
 * Prisma SQL Object
 */
export const prisma = new PrismaClient({ adapter })