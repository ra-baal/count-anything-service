import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { accountQueriesPrisma } from "../../../infrastructure/queries/accountQueries.js";
import { decodeToken } from "../../../common/tokenService.js";
import { newResponseSuccess } from "../../apiResponse.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

const invalidTokenError = "Invalid access_token in cookies data";
const noTokenRequestError = "Token does not exist in cookies data";
const dbError = "Inner error during connection with Database";

/**
 * Endpoint function that return all data about user that send request.
 * Use Auth Middleware to check user
 * @param req Request Object
 * @param res Response Object
 * @returns Ready to user response object
 */
export async function getInfoAccount(req: Request, res: Response) {
  //Getting token from cookies
  const { access_token } = req.cookies;
  if (!access_token)
    return res.status(401).json({ error: noTokenRequestError });

  try {
    //Decrypt token
    const decryptedToken = decodeToken(access_token);
    if (typeof decryptedToken === "string")
      return res.status(400).json({ error: invalidTokenError });
    const { email } = decryptedToken;

    const accountInfo = await accountQueriesPrisma.info(email);
    if (accountInfo === null) {
      return res.status(400).json({ error: invalidTokenError });
    }

    //Return account info
    const success = newResponseSuccess(accountInfo);
    return res.status(200).json(success);
  } catch (err) {
    //Validate token
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({ error: invalidTokenError });
    }
    else if (err instanceof PrismaClientKnownRequestError)
      return res.status(500).json({ error: dbError });
    else throw err;
  }
}
