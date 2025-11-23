import type { Request, Response } from "express";
import type { Counter } from "../../common/counter.js";
import { sql } from "../../database.js";

export async function resetCounter(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const resetedCounter = (await sql`
      UPDATE counters
      SET value = 0
      WHERE id = ${id}
      RETURNING *
      `) as Counter[];

    if (!resetedCounter) {
      res.status(404).json({ error: `Counter with id: ${id} not found` });
    }

    return res.json(resetedCounter);
  } catch (error) {
    res.status(500).json({ error: `Could not reset counter with id: ${id}` });
  }
}
