import type { Request, Response } from "express";
import { accountQueriesPrisma } from "../../../infrastructure/queries/accountQueries.js";
import { hash } from "argon2";
import { z } from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

const invalidRequestError =
  "Invalid request body. Expected: { email: string, password: string }";
const dbError = "Inner error during connection with Database";
export const minPasswordLength = 9;

const AccountModel = z.object({
  email: z
    .email({ message: "Podaj poprawny adres email" })
    .min(1, "Email jest wymagany"),

  password: z
    .string()
    .min(
      minPasswordLength,
      `Hasło musi mieć co najmniej ${minPasswordLength} znaków`
    )
    .regex(/[A-Z]/, "Hasło musi zawierać przynajmniej jedną wielką literę")
    .regex(/\d/, "Hasło musi zawierać przynajmniej jedną cyfrę"),
});

type CreateAccountModel = z.infer<typeof AccountModel>;

/**
 * Endpoint Function to Handle Register Account.
 * Save user data to DB.
 * @param req Request Object
 * @param res Response Object
 * @returns Configured Response Object
 */
export async function registerAccount(req: Request, res: Response) {
  //Validate data
  const result = AccountModel.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: result.error.message,
    });
  }
  const newAccount: CreateAccountModel = result.data;

  try {
    //Hashing password
    newAccount.password = await hash(newAccount.password);

    //Push to DB
    const accountId = await accountQueriesPrisma.register(
      newAccount.email,
      newAccount.password
    );
    return res.status(200).json({ id: accountId });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError)
      return res.status(500).json({ error: dbError });
    else throw err;
  }
}
