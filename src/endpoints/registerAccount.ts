import { response } from "express"

type CreateAccountModel = {
    email: string,
    password: string
}

function isReqBodyCAM(obj: any): obj is CreateAccountModel {
    return (
        obj !== null &&
        typeof obj.email === 'string' &&
        typeof obj.password === 'string' &&
        Object.keys(obj).length === 2
    );
}

export async function registerAccount(req, res) {
    //TODO: Improve
    if (!isReqBodyCAM(req.body)) {
        return res.status(400).json({ 
            error: 'Invalid request body. Expected: { email: string, password: string }' 
        });
    }
    const account: CreateAccountModel = req.body;

    //TODO: Validate
    if (account.email === null || account.password === null)
        return res.status(400);

    //TODO: Push to DB

    return res.status(200).send(account);
}