import cors from "cors";

const allowedOrigins =
  process.env.CORS_ALLOWED_ORIGINS?.split(",").map(
    (x) => x.trim().replace(/\/$/, "") // trim whitespace and trailing slash
  ) ?? [];

export function corsMiddleware() {
  return cors({
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
    credentials: true,
  });
}
