import express from "express";
import { dbTime, dbVersion } from "./infrastructure/queries/systemQueries.js";
import { registerAccount } from "./endpoints/accounts/registerAccount.js";
import { getCounters } from "./endpoints/counters/getCounters.js";
import { createCounter } from "./endpoints/counters/createCounter.js";
import { incrementCounter } from "./endpoints/counters/incrementCounter.js";
import { decrementCounter } from "./endpoints/counters/decrementCounter.js";
import { deleteCounter } from "./endpoints/counters/deleteCounter.js";
import { resetCounter } from "./endpoints/counters/resetCounter.js";

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

app.get("/counters", getCounters);
app.post("/counters", createCounter);
app.post("/counters/:id/increment", incrementCounter);
app.post("/counters/:id/decrement", decrementCounter);
app.post("/counters/:id/reset", resetCounter);
app.delete("/counters/:id/delete", deleteCounter);

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
