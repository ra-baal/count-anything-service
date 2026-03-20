import { sql } from "../database.js";

type CreatePasswordResetToken = {
  accountId: string;
  tokenId: string;
  tokenHash: string;
  expiresAt: Date;
  usedAt: Date | null;
};

async function createToken({
  accountId,
  tokenId,
  tokenHash,
  expiresAt,
  usedAt,
}: CreatePasswordResetToken): Promise<void> {
  await sql`
    INSERT INTO password_reset_tokens
    (account_id, token_id, token_hash, created_at, expires_at, used_at)
    VALUES (${accountId}, ${tokenId}, ${tokenHash}, NOW(), ${expiresAt}, ${usedAt})
    `;
}

async function deleteTokens(accountId: string): Promise<void> {
  await sql`
  DELETE FROM password_reset_tokens
  WHERE account_id=${accountId}  
  `;
}

async function updatePasswordAndKillToken(
  tokenId: string,
  accountId: string,
  hashedPassword: string,
): Promise<void> {
  await sql.transaction((tx) => [
    tx`
  UPDATE passwords
  SET hashedvalue = ${hashedPassword}
  WHERE accountid = ${accountId}
  `,
    tx`
  UPDATE password_reset_tokens
  SET used_at = ${new Date()}
  WHERE token_id = ${tokenId}
  `,
  ]);
}

async function findToken(
  tokenId: string,
): Promise<CreatePasswordResetToken | undefined> {
  const result = await sql`
  SELECT     
    account_id AS "accountId", 
    token_id AS "tokenId",
    token_hash AS "tokenHash",
    expires_at AS "expiresAt",
    used_at AS "usedAt"
  FROM password_reset_tokens
  WHERE token_id=${tokenId}
  `;

  return (result[0] as CreatePasswordResetToken) || undefined;
}

export const passwordResetQueries = {
  createToken,
  deleteTokens,
  updatePasswordAndKillToken,
  findToken,
};
