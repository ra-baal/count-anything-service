import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Service is running");
});

app.get("/hello", (req, res) => {
  res.send("Hello World");
});

// Only start listening if not in Vercel (serverless).
if (process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () =>
    console.log(`\nRunning at http://localhost:${PORT}\n`)
  );
}

// For Vercel.
export default app;
