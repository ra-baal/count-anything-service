import { sql } from "../database.js";

export async function dbVersion() {
  const [row] = await sql`SELECT version()`;
  return row.version;
}

export async function dbTime(): Promise<Date> {
  const [row] = await sql`SELECT now() AS time`;
  return new Date(row.time);
}
