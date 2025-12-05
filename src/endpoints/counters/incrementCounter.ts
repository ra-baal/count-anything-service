import type { Request, Response } from "express";
import { counterQueries } from "../../infrastructure/queries/counterQueries.js";

export async function incrementCounter(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const updatedCounter = await counterQueries.increment(id);

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
