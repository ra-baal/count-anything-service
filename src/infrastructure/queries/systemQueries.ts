import { sql } from "../database.js";

export async function dbVersion() {
  const [row] = await sql`SELECT version()`;

  if (!row || !row.version) {
    throw new Error("Failed to retrieve database version");
  }

  return row.version;
}

export async function dbTime(): Promise<Date> {
  const [row] = await sql`SELECT now() AS time`;

  if (!row || !row.time) {
    throw new Error("Failed to retrieve database time");
  }

  return new Date(row.time);
}
