import { Request, Response } from "express";
import z from "zod";
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

const BodyModel = z.object({
    email: z.email({ message: "Podaj poprawny adres email" })
    .min(1, "Email jest wymagany")
});
type BodyModelType = z.infer<typeof BodyModel>;

/**
 * Endpoint function to change email of current log in user
 * @param req Request Object
 * @param res Response Object
 * @returns Ready to use response object
 */
export async function changeEmail(req: Request, res: Response) {
    //Validate data
    const result = BodyModel.safeParse(req.body);
    if (!result.success) {
    return res.status(400).json({
      error: result.error.message,
    });
  }
  const data: BodyModelType = result.data;
  const userId = Number(req.userId ?? "0"); //UserId zawsze bedzie mialo wartosc

  try {
    //Push to DB
    await accountQueriesPrisma.changeEmail(data.email, userId);
    return res.status(200).json({ success: true });
  } catch(err) {
       if (err instanceof PrismaClientKnownRequestError)
          return res.status(500).json({ error: dbError });
      else throw err;
  }
}