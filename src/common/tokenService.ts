import jwt from "jsonwebtoken"

export function generateAuthKey(userId: string, email: string) {
    const secretKey = process.env.COUNT_ANYTHING_TOKEN_SECRET_KEY;
    if (!secretKey) {
        throw new Error("COUNT_ANYTHING_TOKEN_SECRET_KEY environment variable is not defined");
    }

    const access_token = jwt.sign({
        userId: userId,
        email: email },
        secretKey,
        { expiresIn: "1h" });
    return access_token;
}

export function decodeToken(token: string) {
    const secretKey = process.env.COUNT_ANYTHING_TOKEN_SECRET_KEY;
    if (!secretKey) {
        throw new Error("COUNT_ANYTHING_TOKEN_SECRET_KEY environment variable is not defined");
    }

    return jwt.verify(token, secretKey);
}