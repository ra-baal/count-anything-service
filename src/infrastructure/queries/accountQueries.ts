import { sql } from "../database.js";

type AccountInfoModel = {
  id: string,
  email: string,
  creationdate: string
};

async function insertAccount(email: string, passwordHash: string) {
  // W srodowisku serverless nie mozna polegac na tradycyjnych transakcjach,
  // dlatego uzywamy jednego atomowego zapytania, ktore tworzy konto i haslo w spojny sposob.
  const [result] = await sql`
    WITH new_account AS (
      INSERT INTO accounts (email) 
      VALUES (${email}) 
      RETURNING id
    )
    INSERT INTO passwords (accountid, hashedvalue)
    SELECT id, ${passwordHash} FROM new_account
    RETURNING accountid AS id;
  `;

  return result.id;
}

async function getLoginCredential(email: string): Promise<string[]> {
  const [result] = await sql`
    SELECT pass.accountid, pass.hashedvalue FROM accounts
      JOIN passwords AS pass ON accounts.id = pass.accountid
      WHERE email = ${email}
      FETCH FIRST 1 ROWS ONLY;`;

  if (result == null) throw new Error("empty");
  return [result.accountid, result.hashedvalue];
}

async function getAccountInfo(email: string): Promise<AccountInfoModel> {
  const [result] = await sql`
    SELECT id, email, creationdate FROM accounts
    WHERE email = ${email} FETCH FIRST 1 ROWS ONLY;`;

  if (result == null) throw new Error("empty");
  return result as AccountInfoModel;
}

export const accountQueries = {
  register: insertAccount,
  login: getLoginCredential,
  info: getAccountInfo
};