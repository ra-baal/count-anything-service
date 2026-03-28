import { dropAccount } from "../../api/endpoints/accounts/dropAccount.js";
import { Prisma } from "../../generated/prisma/client.js";
import { sql, prisma } from "../database.js";

type AccountInfoModel = {
  id: string,
  email: string,
  creationdate: string
};

type LoginCredentialModel = Prisma.AccountGetPayload<{ select: { id: true; email: true; password: { select: { hashedValue: true }}}}>;

/**
 * Save user object in DB
 * @param email user's email
 * @param passwordHash user's password hashed Argon2
 */
async function insertAccountPrisma(email: string, passwordHash: string) {
  try {
    //Create new object in DB
    const prismaObj = await prisma.account.create({
      data: {
        email: email,
          password: {
          create: {
            hashedValue: passwordHash
          }
        }
      },
      include: {
        password: true
      }
    });
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Get account object from DB where emails equals given as argument and is active.
 * When doesn't find any object return null
 * @param email user's email
 * @returns User object in DB with password object
 */
async function getLoginCredentialPrisma(email: string): Promise<LoginCredentialModel | null> {
  try {
    //Get account object from DB where email equals and isActive = true
    const prismaObj = await prisma.account.findFirst({
      where: { email: email, isActive: true },
      select: { id: true, email: true, password: { select: { hashedValue: true }}}
    });
    return prismaObj;
  } finally {
    await prisma.$disconnect();
  }
}

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
      WHERE email = ${email} AND isactive = ${true}
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

async function setNewEmail(email: string, userId: string) {
  await sql`
    UPDATE accounts SET email = ${email}, editeddate = NOW()
    WHERE id = ${userId};`;
}

async function inactiveAccount(userId: string) {
  await sql`
  UPDATE accounts SET isactive = ${false}, inactivedate = NOW()
  WHERE id = ${userId};`;
}

export const accountQueries = {
  register: insertAccount,
  login: getLoginCredential,
  info: getAccountInfo,
  changeEmail: setNewEmail,
  dropAccount: inactiveAccount
};

export const accountQueriesPrisma = {
  register: insertAccountPrisma,
  login: getLoginCredentialPrisma
}