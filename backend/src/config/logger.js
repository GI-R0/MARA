import winston from "winston";

// Formato personalizado
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    return JSON.stringify({
      timestamp,
      level: level.toUpperCase(),
      message,
      ...meta,
    });
  }),
);

const transports = [
  // Console para desarrollo y Vercel
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple(),
      winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} ${level}: ${message}`;
      }),
    ),
  }),
];

// Solo guardar en archivos si NO estamos en Vercel (evita error de sistema de archivos de solo lectura)
if (!process.env.VERCEL) {
  transports.push(
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      format: customFormat,
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
      format: customFormat,
    })
  );
}

// Configuración del logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: customFormat,
  transports,
});

// En producción estándar (no Vercel), podríamos querer quitar la consola
if (process.env.NODE_ENV === "production" && !process.env.VERCEL) {
  logger.remove(winston.transports.Console);
}

export default logger;
