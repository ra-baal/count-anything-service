import { passwordResetQueries } from "../infrastructure/queries/passwordResetQueries.js";
import argon2 from "argon2";

export default async function validateTokenLogic(token: string) {
  if (!token || !token.includes(".")) {
    throw {
      status: 400,
      error: "Nieprawidłowy format tokena",
    };
  }

  const [tokenId, secret] = token.split(".");
  const record = await passwordResetQueries.findToken(tokenId);

  if (!record) {
    throw { status: 400, error: "Nie znaleziono token_id w bazie" };
  }

  if (record.usedAt) {
    throw { status: 400, error: "Token wygasł lub został już zużyty" };
  }

  if (new Date() > record.expiresAt) {
    throw { status: 400, error: "Link wygasł" };
  }

  const isSecretValid = await argon2.verify(record.tokenHash, secret);
  if (!isSecretValid) {
    throw { status: 400, error: "Nieprawidłowy token" };
  }

  return record;
}
