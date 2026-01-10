import { NeonDbError } from "@neondatabase/serverless";
import { Request, Response } from "express";
import z from "zod";
import { accountQueries } from "../../../infrastructure/queries/accountQueries.js";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

const dbError = "Inner error during connection with Database";

const BodyModel = z.object({
    email: z.email({ message: "Podaj poprawny adres email" })
    .min(1, "Email jest wymagany")
});
type BodyModelType = z.infer<typeof BodyModel>;

export async function changeEmail(req: Request, res: Response) {
    //Validate data
    const result = BodyModel.safeParse(req.body);
    if (!result.success) {
    return res.status(400).json({
      error: result.error.message,
    });
  }
  const data: BodyModelType = result.data;
  const userId = req.userId ?? ""; //UserId zawsze bedzie mialo wartosc

  try {
    //Push to DB
    await accountQueries.changeEmail(data.email, userId);
    return res.status(200).json({ success: true });
  } catch(err) {
       if (err instanceof NeonDbError)
          return res.status(500).json({ error: dbError });
      else throw err;
  }
}