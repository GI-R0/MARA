import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import logger from "./config/logger.js";
import pistaRoutes from "./routes/pista.routes.js";
import reservaRoutes from "./routes/reserva.routes.js";
import authRoutes from "./routes/auth.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { apiLimiter } from "./middlewares/rateLimiter.js";
import { getAllowedOrigins } from "./config/cookies.js";

dotenv.config();

try {
  await connectDB();
  logger.info("✅ Conectado a MongoDB");
} catch (err) {
  logger.error("⚠️  Error conectando a MongoDB:", err.message);
  if (process.env.NODE_ENV === "production") {
    process.exit(1);
  }
}

const app = express();
app.set("trust proxy", 1);
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
const allowedOrigins = getAllowedOrigins();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(morgan("dev"));

app.use("/api/", apiLimiter);

app.use("/api/pistas", pistaRoutes);
app.use("/api/reservas", reservaRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/", (req, res) => {
  res.send("Servidor SportifyClub funcionando 🏆");
});

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/version", (req, res) => {
  res.json({
    commit: process.env.RAILWAY_GIT_COMMIT_SHA || "unknown",
  });
});

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || "0.0.0.0";
app.listen(PORT, HOST, () =>
  logger.info(`Servidor corriendo en ${HOST}:${PORT}`),
);
