import { Request, Response } from "express";
import { passwordResetQueries } from "../../../../infrastructure/queries/passwordResetQueries.js";
import argon2 from "argon2";
import validateTokenLogic from "../../../../common/passwordResetService.js";

export default async function confirmPasswordReset(
  req: Request,
  res: Response,
) {
  try {
    const { token, newPassword } = req.body;

    if (newPassword.length < 9) {
      return res.status(400).json({ message: "Hasło jest za krótkie" });
    }

    const record = await validateTokenLogic(token);

    const hashedPassword = await argon2.hash(newPassword);
    const tokenId = token.split(".")[0];
    const accountId = record.accountId;

    await passwordResetQueries.updatePasswordAndKillToken(
      tokenId,
      accountId,
      hashedPassword,
    );

    return res.json({
      success: true,
      message: "Hasło zostało pomyślnie zmienione. Możesz się zalogować",
    });
  } catch (err: any) {
    console.log(err);
    return res.status(err.status || 500).json({
      success: false,
      error: err.message || "Wewnętrzny błąd serwera",
    });
  }
}
