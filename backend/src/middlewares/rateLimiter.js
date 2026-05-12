import rateLimit, { ipKeyGenerator } from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 5,

  message:
    "Demasiados intentos de inicio de sesión. Intenta después de 15 minutos.",
  standardHeaders: true,

  legacyHeaders: false,

  skip: (req, res) => {
    return process.env.NODE_ENV === "development";
  },
  keyGenerator: (req, res) => {
    return req.body?.email || ipKeyGenerator(req, res);
  },
});

export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,

  max: 3,

  message:
    "Demasiadas cuentas creadas recientemente. Intenta después de 1 hora.",
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: ipKeyGenerator,
});

export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,

  max: 30,

  message: "Demasiadas solicitudes. Intenta después de un minuto.",
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req, res) => {
    return process.env.NODE_ENV === "development";
  },
});

export const createPistaLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,

  max: 10,

  message: "Has creado demasiadas pistas. Intenta después de 1 hora.",
  standardHeaders: true,
  legacyHeaders: false,
});

export const createReservaLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,

  max: 20,

  message: "Has hecho demasiadas reservas. Intenta después de 1 hora.",
  standardHeaders: true,
  legacyHeaders: false,
});

export default {
  loginLimiter,
  registerLimiter,
  apiLimiter,
  createPistaLimiter,
  createReservaLimiter,
};
