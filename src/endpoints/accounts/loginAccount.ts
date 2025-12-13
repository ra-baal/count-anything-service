import type { Request, Response } from "express";
import { NeonDbError } from "@neondatabase/serverless";
import { verify } from "argon2";
import * as zod from "zod";
import { accountQueries } from "../../infrastructure/queries/accountQueries.js";
import jwt from "jsonwebtoken";

const invalidRequestError =
    "Invalid request body. Expected: { email: string, password: string }";
const noaccountRequestError =
    "There is no account with that email and password";

const AccountModel = zod.object({
    email: zod.email(),
    password: zod.string().min(3)
});
type LoginAccountModel = zod.infer<typeof AccountModel>;

export async function loginAccount(req: Request, res: Response) {
    //Validate data
    const result = AccountModel.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            error: invalidRequestError
        });
    }
    const newAccount: LoginAccountModel = result.data;

    try {
        //Find account in DB
        const [accountId, hashedValue] = await accountQueries.login(newAccount.email);

        //Check if passwords are same
        if ((!await verify(hashedValue, newAccount.password))) {
            return res.status(400).json({ error: noaccountRequestError });
        }

        //Creating JWT Token
        const secretKey = process.env.COUNT_ANYTHING_TOKEN_SECRET_KEY;
        if (!secretKey) {
            throw new Error("COUNT_ANYTHING_TOKEN_SECRET_KEY environment variable is not defined");
        }

        const { sign } = jwt;
        const token = sign({
            userId: accountId,
            email: newAccount.email
        },
            secretKey,
            { expiresIn: "1h" });

        //Return data and send token as cookie
        return res.status(200).cookie("token", token).json({
            userId: accountId,
            email: newAccount.email,
            token: token
        });
    } catch (err) {
        //Check if account exist
        if (err instanceof Error && err.message == "empty")
            return res.status(400).json({ error: noaccountRequestError });
        else if (err instanceof NeonDbError)
            return res.status(500).json({ error: err.detail });
        else throw err;
    }
}