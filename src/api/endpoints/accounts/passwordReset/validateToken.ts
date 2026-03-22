import { Request, Response } from "express";
import validateTokenLogic from "../../../../common/passwordResetService.js";

export default async function validateResetToken(req: Request, res: Response) {
  try {
    const { token } = req.body;
    if (!token || !token.includes(".")) {
      return res
        .status(400)
        .json({ isValid: false, message: "Nieprawidłowy format tokena" });
    }

    const record = await validateTokenLogic(token);
    return res.json({
      isValid: true,
      message: "Token jest poprawny",
      tokenId: token.split(".")[0],
    });
  } catch (err: any) {
    return res.status(err.status || 500).json({
      isValid: false,
      error: err.message || "Wewnętrzny błąd serwera",
    });
  }
}
