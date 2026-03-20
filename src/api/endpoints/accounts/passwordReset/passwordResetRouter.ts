import { Router } from "express";
import requestPasswordReset from "./request.js";
import confirmPasswordReset from "./confirm.js";
import validateResetToken from "./validateToken.js";

const router = Router();

router.post("/request", requestPasswordReset);
router.patch("/confirm", confirmPasswordReset);
router.post("/validate-token", validateResetToken);

export default router;
