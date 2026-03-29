import { Request, Response } from "express";
import { accountQueriesPrisma } from "../../../infrastructure/queries/accountQueries.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

const dbError = "Inner error during connection with Database";

/**
 * Endpoint function to remove current logged in user from DB.
 * @param req Request Object
 * @param res Response Object
 * @returns Ready to use response object
 */
export async function dropAccount(req: Request, res: Response) {
    //Get userid
    const userId = Number(req.userId ?? "0");

    try {
        //Push to DB
        await accountQueriesPrisma.dropAccount(userId);
        return res.clearCookie("access_token").status(200).json({ success: true });
    } catch (err) {
        if (err instanceof PrismaClientKnownRequestError)
            return res.status(500).json({ error: dbError });
        else throw err;
    }
}