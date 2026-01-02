import { Router } from "express";
import { loginAccount } from "./loginAccount.js";
import { getInfoAccount } from "./infoAccount.js";
import { logoutAccount } from "./logoutAccount.js";
import { auth } from "../../middleware/authMiddleware.js";

const router = Router();

router.post("/login", loginAccount);
router.post("/logout", logoutAccount);
router.get("/me", auth, getInfoAccount);

export default router;
