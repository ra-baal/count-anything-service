import express from "express";
import cors from "cors";
import { dbTime, dbVersion } from "./infrastructure/queries/systemQueries.js";
import { registerAccount } from "./endpoints/accounts/registerAccount.js";
import { loginAccount } from "./endpoints/accounts/loginAccount.js";
import cookieParser from "cookie-parser";
import { logoutAccount } from "./endpoints/accounts/logoutAccount.js";
import { getInfoAccount } from "./endpoints/accounts/infoAccount.js";
import countersRouter from "./endpoints/counters/countersRouter.js";

const app = express();

const allowedOrigins =
  process.env.CORS_ALLOWED_ORIGINS?.split(",").map(
    (x) => x.trim().replace(/\/$/, "") // trim whitespace and trailing slash
  ) ?? [];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like Postman or server-side requests)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", async (req, res) => {
  res.send("Service is running");
});

app.get("/hello", (req, res) => {
  res.send("Hello World");
});

app.get("/db-test", async (req, res) => {
  const version = await dbVersion();
  const time = await dbTime();
  console.log(version, time);
  res.json({ version: version, time: time });
});

app.post("/account/register", registerAccount);
app.post("/auth/login", loginAccount);
app.get("/auth/logout", logoutAccount);
app.get("/auth/me", getInfoAccount);

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
