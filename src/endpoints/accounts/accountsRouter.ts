import { Router } from "express";
import { registerAccount } from "./registerAccount.js";

const router = Router();

router.post("/register", registerAccount);

export default router;
