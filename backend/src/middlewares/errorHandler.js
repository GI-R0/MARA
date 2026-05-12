import logger from "../config/logger.js";

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const errorHandler = (err, req, res, next) => {
  logger.error("[ERROR]", {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    status: err.status || 500,
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });

  if (res.headersSent) {
    return next(err);
  }

  if (err.array && typeof err.array === "function") {
    const errors = err.array();
    return res.status(400).json({
      msg: "Error de validación",
      errors: errors.map((e) => ({ field: e.param, message: e.msg })),
    });
  }

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ msg: "Error de validación", errors });
  }

  if (err.name === "CastError") {
    return res.status(400).json({ msg: "ID inválido" });
  }

  if (err.code === 11000) {
    const field = err.keyValue ? Object.keys(err.keyValue)[0] : (err.keyPattern ? Object.keys(err.keyPattern)[0] : "campo");
    return res.status(409).json({ msg: `El ${field} ya existe o está registrado` });
  }

  if (err.name === "MongooseError") {
    return res.status(400).json({ msg: "Error en la base de datos" });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ msg: "Token inválido" });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ msg: "Token expirado" });
  }

  res.status(err.status || 500).json({
    msg: process.env.NODE_ENV === "production" ? "Error interno del servidor" : err.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
