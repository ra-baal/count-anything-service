import { Router } from "express";
import { getCounters } from "./getCounters.js";
import { createCounter } from "./createCounter.js";
import { incrementCounter } from "./incrementCounter.js";
import { decrementCounter } from "./decrementCounter.js";
import { deleteCounter } from "./deleteCounter.js";
import { resetCounter } from "./resetCounter.js";

const router = Router();

router.get("/", getCounters);
router.post("/", createCounter);
router.post("/:id/increment", incrementCounter);
router.post("/:id/decrement", decrementCounter);
router.post("/:id/reset", resetCounter);
router.delete("/:id/delete", deleteCounter);

export default router;
