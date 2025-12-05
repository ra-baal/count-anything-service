import { sql } from "../database.js";

export async function insertAccount(email: string, passwordHash: string) {
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
