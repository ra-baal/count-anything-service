import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

export async function logoutAccount(req: Request, res: Response) {
    return res.clearCookie("token").status(200).json("Clear token flag was set successfully");
}