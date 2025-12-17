import type { Request, Response } from "express";
import { counterQueries } from "../../infrastructure/queries/counterQueries.js";
import { Counter } from "../../common/counter.js";

export async function getCounters(req: Request, res: Response) {
  try {
    const counters: Counter[] = await counterQueries.getAll();

    return res.json(counters);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Error fetching counters from server" });
  }
}
