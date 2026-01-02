import { Router } from "express";
import { getCounters } from "./getCounters.js";
import { createCounter } from "./createCounter.js";
import { incrementCounter } from "./incrementCounter.js";
import { decrementCounter } from "./decrementCounter.js";
import { deleteCounter } from "./deleteCounter.js";
import { resetCounter } from "./resetCounter.js";
import { auth } from "../../infrastructure/middleware/authMiddleware.js";

const router = Router();

router.get("/", auth, getCounters);
router.post("/", auth, createCounter);
router.post("/:id/increment", auth, incrementCounter);
router.post("/:id/decrement", auth, decrementCounter);
router.post("/:id/reset", auth, resetCounter);
router.delete("/:id/delete", auth, deleteCounter);

export default router;
