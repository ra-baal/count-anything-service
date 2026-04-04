import type { Request, Response } from "express";
import {
  dbTime,
  dbVersion,
} from "../../../infrastructure/queries/systemQueries.js";
import pkg from "../../../../package.json" with { type: "json" };
import { env } from "process";

export async function health(req: Request, res: Response): Promise<Response> {
  let dbOk: boolean = false;
  let dbTimeIso: string | null = null;
  let dbVer: string | null = null;

  try {
    const dbTimeValue: Date = await dbTime();
    dbVer = await dbVersion();
    dbOk = true;
    dbTimeIso = dbTimeValue.toISOString();
  } catch {
    dbOk = false;
  }

  const obj = {
    env: env.NODE_ENV,
    name: pkg.name,
    version: pkg.version,
    status: true ? "working" : "error",
    time: new Date().toISOString(),
    database: {
      status: dbOk ? "working" : "error",
      version: dbVer,
      time: dbTimeIso,
    },
  };

  return res.json(obj);
}
