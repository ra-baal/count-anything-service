import type { Request, Response } from "express";
import { NeonDbError } from "@neondatabase/serverless";
import { verify } from "argon2";
import * as zod from "zod";
import { accountQueries } from "../../../infrastructure/queries/accountQueries.js";
import jwt from "jsonwebtoken";
import { generateAuthKey } from "../../../common/tokenService.js";

const invalidRequestError =
  "Invalid request body. Expected: { email: string, password: string }";
const noaccountRequestError =
  "There is no account with that email and password";
const dbError = "Inner error during connection with Database";

const AccountModel = zod.object({
  email: zod.email(),
  password: zod.string().min(3),
});
type LoginAccountModel = zod.infer<typeof AccountModel>;

export async function loginAccount(req: Request, res: Response) {
  //Validate data
  const result = AccountModel.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: invalidRequestError,
    });
  }
  const account: LoginAccountModel = result.data;

  try {
    //Find account in DB
    const [accountId, hashedValue] = await accountQueries.login(account.email);

    //Check if passwords are same
    if (!(await verify(hashedValue, account.password))) {
      return res.status(400).json({ error: noaccountRequestError });
    }

    const access_token = generateAuthKey(accountId, account.email);

    //Return data and send token as cookie
    return res
      .status(200)
      .cookie("access_token", access_token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .json({
        userId: accountId,
        email: account.email,
      });
  } catch (err) {
    //Check if account exist
    if (err instanceof Error && err.message == "empty")
      return res.status(400).json({ error: noaccountRequestError });
    else if (err instanceof NeonDbError)
      return res.status(500).json({ error: dbError });
    else throw err;
  }
}
