import { NeonDbError } from "@neondatabase/serverless";
import { insertAccount } from "../database.js";
import { hash, verify } from "argon2"
import { emailRegex } from "../common/regex.js";

const invalidRequestError = 'Invalid request body. Expected: { email: string, password: string }';

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
    return emailRegex.test(email);
}

export async function registerAccount(req, res) {
    //Check if request send valid data
    if (!isReqBodyCAM(req.body)) {
        return res.status(400).json({ 
            error: invalidRequestError
        });
    }
    const account: CreateAccountModel = req.body;

    //Validate data
    if (account.email === null || account.password === null)
        return res.status(400).json({ 
            error: invalidRequestError
        });
    else if (!isValidEmail(account.email))
        return res.status(400).json({ 
            error: invalidRequestError
        });

    try {
        //Hashing password
        account.password = await hash(account.password);

        //Push to DB
        const accountId = await insertAccount(account.email, account.password);
        return res.status(200).json({id: accountId});
    } catch (err) {
        if (err instanceof NeonDbError)
            return res.status(500).json({error: err.detail});
        else throw err;
    }
}