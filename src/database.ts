import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

// [server]
// Load environment variables from .env.development.local for local development.
dotenv.config({ path: ".env.development.local" });

export const sql = neon(process.env.COUNT_ANYTHING_DB_DATABASE_URL);

export async function dbVersion() {
  const [row] = await sql`SELECT version()`;
  return row.version;
}

export async function dbTime() {
  const [row] = await sql`SELECT now() AS time`;
  return row.time;
}

export async function insertAccount(email: string, passwordHash: string) {
  const sqlFunction = async () => {
    const [accountResult] = await sql`
      INSERT INTO accounts (email)
      VALUES (${email})
      RETURNING id`;

    const accountId = accountResult.id;

    await sql`
      INSERT INTO passwords (accountid, hashedvalue)
      VALUES (${accountId}, ${passwordHash})`;

    return accountId;
  };

  return createTransaction(sqlFunction);
}

async function createTransaction<T>(fn: () => Promise<T>): Promise<T> {
  await sql`BEGIN;`;
  try {
    // Run sql function
    const result = await fn();
    await sql`COMMIT;`;
    return result;
  } catch (err) {
    await sql`ROLLBACK;`;
    throw err;
  }
}
