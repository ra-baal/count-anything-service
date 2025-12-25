import jwt from "jsonwebtoken"
import { Response, Request, NextFunction } from "express"
import { decodeToken } from "../../common/tokenService.js";

const noTokenError = "Access denied! No token provided";
const invalidToken = "Invalid token";

export function auth(req: Request, res: Response, next: NextFunction) {
    //Get token from cookies
    const { access_token } = req.cookies;
    if (!access_token)
        return res.status(401).send(noTokenError);

    try {
        //Decode the token and end malware
        const decoded = decodeToken(access_token);
        next();
    } catch(err) {
        //Handle error for invalid token
        return res.status(400).send(invalidToken);
    }
}