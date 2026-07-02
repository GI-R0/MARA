import dotenv from "dotenv";

dotenv.config();

export const isProduction = () => process.env.NODE_ENV === "production";

export const getAllowedOrigins = () => {
  const rawValue = process.env.CORS_ORIGIN || process.env.FRONTEND_URL || "http://localhost:5173";

  return rawValue
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const isHttpsRequest = (req) => {
  if (!req) {
    return isProduction();
  }

  const forwardedProto = req.headers?.["x-forwarded-proto"];
  if (typeof forwardedProto === "string") {
    return forwardedProto.split(",")[0].trim().toLowerCase() === "https";
  }

  return req.secure || req.protocol === "https";
};

export const buildCookieOptions = (req, overrides = {}) => {
  const secure = overrides.secure ?? (isHttpsRequest(req) || isProduction());
  const sameSite = overrides.sameSite ?? (secure ? "none" : "lax");

  return {
    httpOnly: true,
    secure,
    sameSite,
    path: "/",
    ...overrides,
    secure,
    sameSite,
  };
};
