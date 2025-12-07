import type { Request, Response } from "express";
import { counterQueries } from "../../infrastructure/queries/counterQueries.js";

export async function resetCounter(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const resetedCounter = await counterQueries.reset(id);

    if (!resetedCounter) {
      res.status(404).json({ error: `Counter with id: ${id} not found` });
    }

    return res.json(resetedCounter);
  } catch (error) {
    res.status(500).json({ error: `Could not reset counter with id: ${id}` });
  }
}
