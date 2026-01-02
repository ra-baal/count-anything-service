import jwt from "jsonwebtoken"
import { Response, Request, NextFunction } from "express"
import { decodeToken } from "../../common/tokenService.js";

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

const noTokenError = "Access denied! No token provided";
const invalidToken = "Invalid token";

function authUser(req: Request, res: Response): string | jwt.JwtPayload {
    //Get token from cookies
    const { access_token } = req.cookies;
    if (!access_token)
        return noTokenError;

    try {
        //Decode the token and end malware
        const decoded = decodeToken(access_token);
        return decoded;
    } catch(err) {
        //Handle error for invalid token
        return invalidToken;
    }
}

export function auth(req: Request, res: Response, next: NextFunction) {
    const authResult = authUser(req, res);

    if (typeof(authResult) === "string") {
        return res.status(401).json({ error: authResult });
    }

    //Sending id next in the pipeline
    req.userId = authResult.userId;
    next();
}