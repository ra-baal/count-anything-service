import type { Request, Response } from "express";
import { dbTime } from "../../../infrastructure/queries/systemQueries.js";
import pkg from "../../../../package.json" with { type: "json" };
import { env } from "process";

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

  const obj = {
    env: env.NODE_ENV,
    name: pkg.name,
    version: pkg.version,
    service: true ? "working" : "error",
    database: dbOk ? "working" : "error",
    serverTime: new Date().toISOString(),
    databaseTime: dbTimeIso,
  };

  return res.status(dbOk ? 200 : 503).json(obj);
}
