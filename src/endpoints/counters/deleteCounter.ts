import type { Request, Response } from "express";
import type { Counter } from "../../common/counter.js";
import { sql } from "../../database.js";

type CounterId = Pick<Counter, "id">;

export async function deleteCounter(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const deletedId = (await sql`
      DELETE FROM counters
      WHERE id = ${id}
      RETURNING id
  `) as CounterId[];

    if (!deletedId) {
      res.status(404).json({ error: `Counter with id: ${id} not found` });
    }

    return res.json(deletedId);
  } catch (error) {
    res.status(500).json({ error: `Could not delete counter with id: ${id}` });
  }
}
