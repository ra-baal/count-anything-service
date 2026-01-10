import { NeonDbError } from "@neondatabase/serverless";
import { Request, Response } from "express";
import { accountQueries } from "../../../infrastructure/queries/accountQueries.js";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

const dbError = "Inner error during connection with Database";

export async function dropAccount(req: Request, res: Response) {
    //Get userid
    const userId = req.userId ?? "";

    try {
        //Push to DB
        await accountQueries.dropAccount(userId);
        return res.status(200).json({ success: true });
    } catch (err) {
        if (err instanceof NeonDbError)
            return res.status(500).json({ error: dbError });
        else throw err;
    }
}