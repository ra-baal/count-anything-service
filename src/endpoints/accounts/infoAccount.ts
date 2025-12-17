import { NeonDbError } from "@neondatabase/serverless";
import type { Request, Response } from "express";
import { console } from "inspector";
import jwt, { JwtPayload } from "jsonwebtoken";
import { accountQueries } from "../../infrastructure/queries/accountQueries.js";

const invalidTokenError =
    "Invalid token in cookies data";
const noTokenRequestError =
    "Token does not exist in cookies data";

export async function getInfoAccount(req: Request, res: Response) {
    //Getting token from cookies
    const { token } = req.cookies;
    if (token == null)
        return res.status(400).json({ error: noTokenRequestError});

    const secretKey = process.env.COUNT_ANYTHING_TOKEN_SECRET_KEY;
    if (!secretKey) {
        throw new Error("COUNT_ANYTHING_TOKEN_SECRET_KEY environment variable is not defined");
    }

    try {
        //Decrypt token
        const decryptedToken = jwt.verify(token, secretKey);
        if (typeof(decryptedToken) === "string")
            return res.status(400).json({ error: invalidTokenError });
        const { email } = decryptedToken;

        //Return account info
        const accountInfo = await accountQueries.info(email);

        return res.status(200).json(accountInfo);
    } catch(err) {
        //Validate token
        if (err instanceof jwt.JsonWebTokenError) {
            return res.status(400).json({ error: invalidTokenError });
        }
        else if (err instanceof Error && err.message == "empty")
            return res.status(400).json({ error: invalidTokenError });
        else if (err instanceof NeonDbError)
            return res.status(500).json({ error: err.detail });
        else throw err;
    }
}