import type { Request, Response } from "express";
import { counterQueries } from "../../infrastructure/queries/counterQueries.js";

export async function createCounter(req: Request, res: Response) {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  try {
    const counter = await counterQueries.create(name);

    res.status(201).json(counter);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
}
