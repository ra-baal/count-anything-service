import type { Request, Response } from "express";
import { NeonDbError } from "@neondatabase/serverless";
import { accountQueries } from "../../infrastructure/queries/accountQueries.js";
import { hash } from "argon2";
import * as zod from "zod";

const invalidRequestError =
  "Invalid request body. Expected: { email: string, password: string }";
const dbError =
    "Inner error during connection with Database";

const AccountModel = zod.object({
    email: zod.email(),
    password: zod.string().min(3)
});

type CreateAccountModel = zod.infer<typeof AccountModel>;

export async function registerAccount(req: Request, res: Response) {
  //Validate data
  const result = AccountModel.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
        error: invalidRequestError
    });
  }
  const newAccount: CreateAccountModel = result.data;

  try {
    //Hashing password
    newAccount.password = await hash(newAccount.password);

    //Push to DB
    const accountId = await accountQueries.register(newAccount.email, newAccount.password);
    return res.status(200).json({ id: accountId });
  } catch (err) {
    if (err instanceof NeonDbError)
      return res.status(500).json({ error: dbError });
    else throw err;
  }
}
