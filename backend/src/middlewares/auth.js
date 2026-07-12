import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ msg: "Token requerido" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ msg: "Usuario no válido" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token inválido o expirado" });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ msg: "Acceso denegado: rol insuficiente" });
    }
    next();
  };
};

export const requireNoActiveSession = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("_id role");

    if (user) {
      return res.status(409).json({
        msg: "Ya hay una sesion activa. Cierra sesion antes de iniciar o crear otra cuenta.",
      });
    }
  } catch (err) {
    // Token invalido/expirado: permitir continuar con login/registro.
  }

  return next();
};
