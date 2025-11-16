import { insertAccount } from "../database.js";

type CreateAccountModel = {
    email: string,
    password: string
}

function isReqBodyCAM(obj: any): obj is CreateAccountModel {
    return (
        typeof obj == 'object' && obj !== null &&
        typeof obj.email === 'string' &&
        typeof obj.password === 'string'
    );
}

function isValidEmail(email: string): boolean {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}

export async function registerAccount(req, res) {
    //Check if request send valid data
    if (!isReqBodyCAM(req.body)) {
        return res.status(400).json({ 
            error: 'Invalid request body. Expected: { email: string, password: string }' 
        });
    }
    const account: CreateAccountModel = req.body;

    //Validate data
    if (account.email === null || account.password === null) return res.status(400);
    else if (!isValidEmail(account.email)) return res.status(400);

    //TODO: Hash password

    //Push to DB
    const accountId = await insertAccount(account.email, account.password);
    return res.status(200).json({id: accountId});
}