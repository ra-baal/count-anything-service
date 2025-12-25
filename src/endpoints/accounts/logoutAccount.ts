import type { Request, Response } from "express";

export async function logoutAccount(req: Request, res: Response) {
    return res.clearCookie("access_token").status(200).json("Clear token flag was set successfully");
}