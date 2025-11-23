import type { Request, Response } from "express";
import type { Counter } from "../../common/counter.js";
import { sql } from "../../database.js";

export async function incrementCounter(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const [updatedCounter] = (await sql`
      UPDATE counters
      SET value = value + 1
      WHERE id = ${id}
      RETURNING *
    `) as Counter[];

    if (!updatedCounter) {
      res.status(404).json({ error: `Counter with id: ${id}  not found` });
    }

    return res.json(updatedCounter);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Could not increment counter with id: ${id}` });
  }
}
