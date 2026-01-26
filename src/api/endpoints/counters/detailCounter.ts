import type { Request, Response } from "express";
import { counterQueries } from "../../../infrastructure/queries/counterQueries.js";
import { CounterEvents } from "../../../common/counter.js";

export async function detailCounters(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const detail: CounterEvents = await counterQueries.detail(id);

    return res.json(detail);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Error fetching counters from server" });
  }
}
