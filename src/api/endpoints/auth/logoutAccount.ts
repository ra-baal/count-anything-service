import type { Request, Response } from "express";
import { newResponseSuccess } from "../../apiResponse.js";

/**
 * Endpoint function to remove access token from client side
 * @param req Request Object
 * @param res Response Object
 * @returns Ready to use response object
 */
export async function logoutAccount(req: Request, res: Response) {
  const sr = newResponseSuccess(
    undefined,
    "Clear token flag was set successfully"
  );
  return res.clearCookie("access_token").status(200).json(sr);
}
