import express from "express";
import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register("ts-node/esm", pathToFileURL("./"));';
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
    app.listen(PORT, () => console.log(`\nRunning at http://localhost:${PORT}\n`));
}
// For Vercel.
export default app;
