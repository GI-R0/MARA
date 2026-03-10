import rateLimit, { ipKeyGenerator } from 'express-rate-limit';

// Limiter para login (5 intentos cada 15 minutos)
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 intentos
  message: 'Demasiados intentos de inicio de sesión. Intenta después de 15 minutos.',
  standardHeaders: true, // Retorna info de rate limit en headers
  legacyHeaders: false, // Deshabilita headers 'X-RateLimit-*'
  skip: (req, res) => {
    // No aplica rate limit si es una solicitud de desarrollo
    return process.env.NODE_ENV === 'development';
  },
  keyGenerator: (req, res) => {
    // Usa el email como clave (en lugar de IP) para ser más efectivo
    return req.body?.email || ipKeyGenerator(req, res);
  },
});

// Limiter para registro (3 registros cada 1 hora)
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // máximo 3 registros
  message: 'Demasiadas cuentas creadas recientemente. Intenta después de 1 hora.',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: ipKeyGenerator,
});

// Limiter general de API (30 requests por minuto)
export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 30, // máximo 30 requests
  message: 'Demasiadas solicitudes. Intenta después de un minuto.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req, res) => {
    return process.env.NODE_ENV === 'development';
  },
});

// Limiter estricto para creación de pistas (10 por hora)
export const createPistaLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10, // máximo 10 pistas por hora
  message: 'Has creado demasiadas pistas. Intenta después de 1 hora.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Limiter para creación de reservas (20 por hora)
export const createReservaLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 20, // máximo 20 reservas por hora
  message: 'Has hecho demasiadas reservas. Intenta después de 1 hora.',
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
