import type { Request, Response } from "express";
import { dbTime } from "../../../infrastructure/queries/systemQueries.js";

export async function health(req: Request, res: Response): Promise<Response> {
  let dbOk: boolean = false;
  let dbTimeIso: string | null = null;

  try {
    const dbTimeValue: Date = await dbTime();
    dbOk = true;
    dbTimeIso = dbTimeValue.toISOString();
  } catch {
    dbOk = false;
  }

  const lines: string[] = [
    "Service: OK",
    `Database: ${dbOk ? "OK" : "ERROR"}`,
    `Server time: ${new Date().toISOString()}`,
    `Database time: ${dbTimeIso ?? "N/A"}`,
  ];

  const body: string = lines.join("\n");

  return res
    .status(dbOk ? 200 : 503)
    .type("text/plain")
    .send(body);
}
