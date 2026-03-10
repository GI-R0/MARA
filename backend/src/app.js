import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import pistaRoutes from "./routes/pista.routes.js";
import reservaRoutes from "./routes/reserva.routes.js";
import authRoutes from "./routes/auth.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import { apiLimiter } from "./middlewares/rateLimiter.js";

dotenv.config();

try {
  await connectDB();
  console.log("✅ Conectado a MongoDB");
} catch (err) {
  console.log("⚠️  Error conectando a MongoDB:", err.message);
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
}

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(morgan("dev"));

// Aplicar rate limiter general a toda la API
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

const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || "0.0.0.0";
app.listen(PORT, HOST, () =>
  console.log(`Servidor corriendo en ${HOST}:${PORT}`)
);

// Error handling middleware
app.use((err, req, res, next) => {
  // Log del error para debugging
  console.error("[ERROR]", {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    status: err.status || 500,
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });

  // Evitar enviar respuesta si ya fue enviada
  if (res.headersSent) {
    return next(err);
  }

  // Errores de validación de express-validator
  if (err.array && typeof err.array === "function") {
    const errors = err.array();
    return res.status(400).json({
      msg: "Error de validación",
      errors: errors.map((e) => ({ field: e.param, message: e.msg })),
    });
  }

  // Errores de MongoDB
  if (err.name === "ValidationError") {
    return res.status(400).json({
      msg: "Error de validación",
      errors: Object.values(err.errors).map((e) => e.message),
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({ msg: "ID inválido" });
  }

  // Duplicate key error (código 11000 de MongoDB)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      msg: `El ${field} ya está registrado en el sistema`,
    });
  }

  // Errores de Mongoose schema
  if (err.name === "MongooseError") {
    return res.status(400).json({ msg: "Error en la base de datos" });
  }

  // Errores de JWT
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ msg: "Token inválido" });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ msg: "Token expirado" });
  }

  // Error genérico
  res.status(err.status || 500).json({
    msg:
      process.env.NODE_ENV === "production"
        ? "Error en el servidor"
        : err.message,
  });
});
