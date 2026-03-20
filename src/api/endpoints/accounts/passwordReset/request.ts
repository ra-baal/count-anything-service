import crypto from "crypto";
import argon2 from "argon2";
import dotenv from "dotenv";
import { Request, Response } from "express";
import { z } from "zod";
import { Resend } from "resend";
import { accountQueries } from "../../../../infrastructure/queries/accountQueries.js";
import { passwordResetQueries } from "../../../../infrastructure/queries/passwordResetQueries.js";

const passwordResetRequestSchema = z.object({
  email: z
    .string()
    .min(1, "Wymagany adres email")
    .email("Podaj poprawny adres email"),
});

dotenv.config({ path: ".env.development.local" });
if (!process.env.RESEND_API_KEY) {
  throw new Error("Missing RESEND_API_KEY");
}
const resend = new Resend(process.env.RESEND_API_KEY);

if (!process.env.FRONTEND_URL) {
  throw new Error("Missing FRONTEND_URL");
}
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

export default async function requestPasswordReset(
  req: Request,
  res: Response,
) {
  try {
    // 1. Email validation

    const result = passwordResetRequestSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.issues[0].message });
    }
    const { email } = result.data;

    // 2. Checking if account exist in DB

    const account = await accountQueries.info(email);

    if (account) {
      // 3. Random token generation

      const tokenId = crypto.randomBytes(16).toString("hex");
      const token = crypto.randomBytes(32).toString("hex");

      // 4. Token hashing

      const tokenHash = await argon2.hash(token);

      // 5. Deleting old tokens
      await passwordResetQueries.deleteTokens(account.id);

      // 6. Creating token
      await passwordResetQueries.createToken({
        accountId: account.id,
        tokenId,
        tokenHash,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        usedAt: null,
      });

      // 7. Sending reset link via e-mail
      const resetLink = `${frontendUrl}/account/password-reset/${tokenId}.${token}`;

      const { data, error } = await resend.emails.send({
        from: "Acme <onboarding@resend.dev>", // Change for verified domain in the future
        to: [email],
        subject: "Resetowanie hasła",
        html: `
      <h1>Count Anything</h1>
      <h2>Resetowanie hasła</h2>
      <p>Kliknij w poniższy przycisk, aby ustawić nowe hasło. Link wygaśnie za godzinę.</p>
      <a href="${resetLink}" style="background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        Zresetuj hasło
      </a>
      <p>Jeśli to nie Ty wysłąłeś prośbę o zresetowania hasła, zignoruj tę wiadomość.</p>
    `,
      });
      if (error) {
        console.error("Błąd Resend:", error);
      } else {
        console.log("Mail wysłany pomyślnie, ID:", data?.id);
      }
    }

    // 8. Returning response that doesn't tell if account exists
    return res.json({
      message:
        "Jeżeli konto istnieje, to wysłano emaila z linkiem resetującym hasło",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Wewnętrzny błąd serwera" });
  }
}
