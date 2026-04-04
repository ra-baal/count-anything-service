import { maskEverySecondChar } from "../../common/helpers.js";
import { sql } from "../database.js";

export async function dbVersion() {
  console.log(
    `(3) NODE_ENV: ${maskEverySecondChar(process.env.COUNT_ANYTHING_DB_DATABASE_URL ?? "")}`,
  );

  const [row] = await sql`SELECT version()`;

  if (!row || !row.version) {
    throw new Error("Failed to retrieve database version");
  }

  return row.version;
}

export async function dbTime(): Promise<Date> {
  console.log(
    `(4) NODE_ENV: ${maskEverySecondChar(process.env.COUNT_ANYTHING_DB_DATABASE_URL ?? "")}`,
  );

  const [row] = await sql`SELECT now() AS time`;

  if (!row || !row.time) {
    throw new Error("Failed to retrieve database time");
  }

  return new Date(row.time);
}
