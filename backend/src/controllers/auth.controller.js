import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

// Función helper para generar tokens
const generateTokens = async (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }, // Token de acceso corto
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  // Guardar refresh token en DB
  await RefreshToken.create({
    token: refreshToken,
    user: user._id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
  });

  return { accessToken, refreshToken };
};

export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, password, role } = req.body;

    const userExist = await User.findOne({ email: email.toLowerCase().trim() });
    if (userExist)
      return res.status(409).json({ msg: "Este correo ya está registrado" });

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: "user", // Solo permitir registro como user, admin/club requieren invitación
    });

    const { accessToken, refreshToken } = await generateTokens(user);

    const userResponse = user.toJSON();
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    };

    res.cookie("token", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 minutos
    });
    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });
    res.status(201).json({
      msg: "Registro completado con éxito",
      user: userResponse,
    });
  } catch (err) {
    console.error("[ERROR] Registering user:", err.message);
    res
      .status(500)
      .json({ msg: "Error al registrar usuario", error: err.message });
  }
};

export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ msg: "Credenciales inválidas" });
    }

    const { accessToken, refreshToken } = await generateTokens(user);

    const userResponse = user.toJSON();
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    };

    res.cookie("token", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 minutos
    });
    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });
    res.json({ user: userResponse });
  } catch (err) {
    console.error("[ERROR] Login:", err.message);
    res.status(500).json({ msg: "Error del servidor", error: err.message });
  }
};

export const getMe = (req, res) => {
  const { password: _, ...userWithoutPass } = req.user.toObject();
  res.json(userWithoutPass);
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken: token } = req.cookies;

    if (!token) {
      return res.status(401).json({ msg: "Refresh token requerido" });
    }

    // Verificar refresh token
    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    );

    // Verificar que existe en DB y no ha expirado
    const storedToken = await RefreshToken.findOne({
      token,
      user: decoded.id,
      expiresAt: { $gt: new Date() },
    });

    if (!storedToken) {
      return res.status(401).json({ msg: "Refresh token inválido o expirado" });
    }

    // Obtener usuario
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ msg: "Usuario no encontrado" });
    }

    // Generar nuevos tokens
    const { accessToken, refreshToken: newRefreshToken } =
      await generateTokens(user);

    // Eliminar refresh token anterior
    await RefreshToken.deleteOne({ _id: storedToken._id });

    // Setear nuevas cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    };

    res.cookie("token", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 60 * 1000,
    });
    res.cookie("refreshToken", newRefreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ msg: "Token refrescado exitosamente" });
  } catch (err) {
    console.error("[ERROR] Refresh token:", err.message);
    res.status(401).json({ msg: "Error al refrescar token" });
  }
};

export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    // Eliminar refresh token de DB si existe
    if (refreshToken) {
      await RefreshToken.deleteOne({ token: refreshToken });
    }

    // Limpiar cookies
    res.clearCookie("token", { path: "/" });
    res.clearCookie("refreshToken", { path: "/" });

    res.json({ msg: "Logout exitoso" });
  } catch (err) {
    console.error("[ERROR] Logout:", err.message);
    res.status(500).json({ msg: "Error en logout" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user._id;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        msg: "El nombre debe tener al menos 2 caracteres",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name: name.trim() },
      { new: true, runValidators: true },
    );

    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    const userResponse = user.toJSON();
    res.json({
      msg: "Perfil actualizado correctamente",
      user: userResponse,
    });
  } catch (err) {
    console.error("[ERROR] Updating profile:", err.message);
    res.status(500).json({
      msg: "Error al actualizar perfil",
      error: err.message,
    });
  }
};
