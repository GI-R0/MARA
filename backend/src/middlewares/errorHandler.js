// Middleware para manejar errores en rutas async
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Middleware de manejo de errores global
export const errorHandler = (err, req, res, next) => {
  console.error("[ERROR]", err.message);
  console.error(err.stack);

  // Errores de validación de Mongoose
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ msg: "Error de validación", errors });
  }

  // Errores de duplicado (índice único)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({ msg: `El ${field} ya existe` });
  }

  // Errores de JWT
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ msg: "Token inválido" });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ msg: "Token expirado" });
  }

  // Error por defecto
  res.status(err.status || 500).json({
    msg: err.message || "Error interno del servidor",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
