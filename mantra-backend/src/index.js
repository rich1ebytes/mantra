import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { corsOptions } from "./config/cors.js";
import { env } from "./config/env.js";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import newsRoutes from "./routes/newsRoutes.js";
import { startNewsCron } from "./jobs/newsCron.js";

const app = express();

// ── Global Middleware ──
app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));


// ── API Routes ──
app.use("/api", routes);
app.use("/api/news", newsRoutes);



// ── Health Check ──
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

startNewsCron(12);


// ── 404 Handler ──
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ── Error Handler (must be last) ──
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`🚀 Mantra API running on port ${env.PORT}`);
  console.log(`📝 Environment: ${env.NODE_ENV}`);
});

export default app;
