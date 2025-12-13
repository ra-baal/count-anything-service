import express from "express";
import { dbTime, dbVersion } from "./infrastructure/queries/systemQueries.js";
import { registerAccount } from "./endpoints/accounts/registerAccount.js";
import countersRouter from "./endpoints/counters/countersRouter.js";

const app = express();
app.use(express.json());

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
