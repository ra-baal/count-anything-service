import type { Request, Response } from "express";
import { counterQueries } from "../../../infrastructure/queries/counterQueries.js";
import { Counter } from "../../../common/counter.js";

export async function getCounters(req: Request, res: Response) {
  //Get userId from request
  const { userId } = req;

  if (typeof userId === "undefined")
    return res.status(500).json({ error: "Internal pipeline error" });

  try {
    const counters: Counter[] = await counterQueries.getAll(userId);

    return res.json(counters);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Error fetching counters from server" });
  }
}
