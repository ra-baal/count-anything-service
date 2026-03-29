import { dropAccount } from "../../api/endpoints/accounts/dropAccount.js";
import { Account, Prisma } from "../../generated/prisma/client.js";
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

/**
 * Get account object from DB where emails equals given as argument
 * When doesn't find any object return null
 * @param email user's email
 * @returns User object in DB
 */
async function getAccountPrisma(email: string): Promise<Account | null> {
  try {
    //Get account object from DB where email equals
    const prismaObj = await prisma.account.findFirst({
      where: { email: email }
    });
    return prismaObj;
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Update on DB side email for account object with id equals given
 * @param email New email
 * @param userId User id
 */
async function setNewEmailPrisma(email: string, userId: number) {
  try {
    //Update email field in DB for Account object with given ID
    const prismaObj = await prisma.account.update({
      where: { id: userId },
      data: { email: email }
    });
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Remove account objects from DB and password object that has relation with to removed account object.
 * @param userId User id
 */
async function deleteAccountPrisma(userId: number) {
  try {
    //Remove account object from DB and any object that has relation with object
    const deletePassword = prisma.password.delete({
      where: { accountId: userId }
    });
    const deleteAccount = prisma.account.delete({
      where: { id: userId }
    });

    const prismaObj = await prisma.$transaction([deletePassword, deleteAccount]);
  } finally {
    await prisma.$disconnect();
  }
}

export const accountQueriesPrisma = {
  register: insertAccountPrisma,
  login: getLoginCredentialPrisma,
  info: getAccountPrisma,
  changeEmail: setNewEmailPrisma,
  dropAccount: deleteAccountPrisma
}

//#region Old Version
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

//#endregion