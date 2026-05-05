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

// Configuración del logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: customFormat,
  transports: [
    // Console para desarrollo
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} ${level}: ${message}`;
        }),
      ),
    }),

    // Archivo para errores
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      format: customFormat,
    }),

    // Archivo para todos los logs
    new winston.transports.File({
      filename: "logs/combined.log",
      format: customFormat,
    }),
  ],
});

// En producción, no loguear a console
if (process.env.NODE_ENV === "production") {
  logger.remove(winston.transports.Console);
}

export default logger;
