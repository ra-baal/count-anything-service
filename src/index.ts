import express from "express";
import { health } from "./api/endpoints/health/health.js";
import cookieParser from "cookie-parser";
import countersRouter from "./api/endpoints/counters/countersRouter.js";
import accountsRouter from "./api/endpoints/accounts/accountsRouter.js";
import authRouter from "./api/endpoints/auth/authRouter.js";
import { corsMiddleware } from "./api/middleware/corsMiddleware.js";

const app = express();

app.use(corsMiddleware());
app.use(express.json());
app.use(cookieParser());

app.get("/", health);

app.use("/auth", authRouter);
app.use("/accounts", accountsRouter);
app.use("/counters", countersRouter);

// [server]
// Only start listening if not in Vercel.
if (process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () =>
    console.log(`\nRunning at http://localhost:${PORT}\n`)
  );
}

// [serverless]
// For Vercel.
export default app;
