import type { Request, Response } from "express";
import type { Counter } from "../../common/counter.js";
import { sql } from "../../database.js";

export async function getCounters(req: Request, res: Response) {
  try {
    const counters = (await sql`
    SELECT * FROM counters 
    ORDER BY id ASC`) as Counter[];

    if (counters.length === 0) {
      return res.status(404).json({ error: "No counters found" });
    }

    return res.json(counters);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Error fetching counters from server" });
  }
}
