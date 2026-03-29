import type { Request, Response } from "express";
import { verify } from "argon2";
import * as zod from "zod";
import { accountQueriesPrisma } from "../../../infrastructure/queries/accountQueries.js";
import { generateAuthKey } from "../../../common/tokenService.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

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

/**
 * Endpoint function to check if credentials to user object is true
 * and return basic user's data and access token to work as that user
 * @param req Request Object
 * @param res Response Object
 * @returns Ready to use response object
 */
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
    const accountObj = await accountQueriesPrisma.login(account.email);

    //Check if account exist
    if (accountObj === null || accountObj.password === null) {
      return res.status(400).json({ error: noaccountRequestError });
    }

    //Check if passwords are same
    if (!(await verify(accountObj.password.hashedValue, account.password))) {
      return res.status(400).json({ error: noaccountRequestError });
    }

    //Generate access token
    const access_token = generateAuthKey(accountObj.id.toString(), account.email);

    //Return data and send token as cookie
    return res
      .status(200)
      .cookie("access_token", access_token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .json({
        userId: accountObj.id,
        email: account.email,
      });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError)
      return res.status(500).json({ error: dbError });
    else throw err;
  }
}
