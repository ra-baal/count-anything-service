import type { Request, Response } from "express";
import type { Counter } from "../../common/counter.js";
import { sql } from "../../database.js";

export async function createCounter(req: Request, res: Response) {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  try {
    const [counter] = (await sql`
      INSERT INTO counters (name, value) 
      VALUES (${name},0)
      RETURNING id, name, value 
    `) as Counter[];

    res.status(201).json(counter);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
}
