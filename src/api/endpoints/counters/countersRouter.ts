import { Router } from "express";
import { getCounters } from "./getCounters.js";
import { createCounter } from "./createCounter.js";
import { incrementCounter } from "./incrementCounter.js";
import { decrementCounter } from "./decrementCounter.js";
import { deleteCounter } from "./deleteCounter.js";
import { resetCounter } from "./resetCounter.js";
import { auth } from "../../middleware/authMiddleware.js";
import { detailCounters } from "./detailCounter.js";

const router = Router();

router.get("/", auth, getCounters);
router.post("/", auth, createCounter);
router.post("/:id/increment", auth, incrementCounter);
router.post("/:id/decrement", auth, decrementCounter);
router.post("/:id/reset", auth, resetCounter);
router.delete("/:id/delete", auth, deleteCounter);
router.get("/:id/details", auth, detailCounters);

export default router;
