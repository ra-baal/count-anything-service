import express from "express";
import { health } from "./api/endpoints/health/health.js";
import cookieParser from "cookie-parser";
import countersRouter from "./api/endpoints/counters/countersRouter.js";
import accountsRouter from "./api/endpoints/accounts/accountsRouter.js";
import authRouter from "./api/endpoints/auth/authRouter.js";
import { corsMiddleware } from "./api/middleware/corsMiddleware.js";

const isDevelopment = process.env.NODE_ENV === "development";
const isVercel = process.env.VERCEL === "1";

console.log(`NODE_ENV: ${process.env.NODE_ENV}`);

const app = setup();

if (isVercel) {
  // [serverless]`
  console.log("Running in serverless mode (Vercel).");
} else {
  // [server]
  run(app);
}

function setup() {
  try {
    console.log("Setting up Express app...");
    const exp = express();

    console.log("Setting up middleware...");
    exp.use(corsMiddleware());
    exp.use(express.json());
    exp.use(cookieParser());

    console.log("Setting up routes...");
    exp.get("/", health);
    exp.use("/auth", authRouter);
    exp.use("/accounts", accountsRouter);
    exp.use("/counters", countersRouter);

    return exp;
  } catch (error) {
    console.error("Error during setup:", error);
    throw error; // Rethrow to prevent starting the server in an inconsistent state
  }
}

function run(a: express.Express) {
  try {
    console.log("Starting server...");
    const port = process.env.PORT || 3000;

    const server = a.listen(port, () => {
      if (isDevelopment) {
        console.log(`Server running at http://localhost:${port}`);
      } else {
        console.log(`Server running on port ${port}`);
      }

      server.on("error", (error) => {
        console.error("Server failed to start:", error);
        process.exit(1);
      });
    });
  } catch (error) {
    console.error("Error during server startup:", error);
    process.exit(1);
  }
}

// [serverless]
export default app;
