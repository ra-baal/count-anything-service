import { Router } from "express";
import { registerAccount } from "./registerAccount.js";
import { auth } from "../../middleware/authMiddleware.js";
import { changeEmail } from "./changeEmail.js";
import { dropAccount } from "./dropAccount.js";
import passwordResetRouter from "./passwordReset/passwordResetRouter.js";

const router = Router();

router.post("/register", registerAccount);
router.post("/email", auth, changeEmail);
router.delete("/delete", auth, dropAccount);

router.use("/password-reset", passwordResetRouter);

export default router;
