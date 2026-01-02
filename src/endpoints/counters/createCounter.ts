import type { Request, Response } from "express";
import { counterQueries } from "../../infrastructure/queries/counterQueries.js";
import * as zod from "zod";

const requestModel = zod.object({
  name: zod.string()
});

export async function createCounter(req: Request, res: Response) {
  //Get userId from request
  const { userId } = req;

  if (typeof(userId) === "undefined")
    return res.status(500).json({ error: "Internal pipeline error" });

  const result = requestModel.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json("Name is required");
  }
  const { name } = result.data;

  try {
    const counter = await counterQueries.create(name, userId);

    res.status(201).json(counter);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
}
