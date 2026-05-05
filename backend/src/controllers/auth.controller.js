import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { asyncHandler } from "../middlewares/errorHandler.js";

const generateTokens = async (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  await RefreshToken.create({
    token: refreshToken,
    user: user._id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return { accessToken, refreshToken };
};

export const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  const userExist = await User.findOne({ email: email.toLowerCase().trim() });
  if (userExist)
    return res.status(409).json({ msg: "Este correo ya está registrado" });

  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
    role: "user",
  });

  const { accessToken, refreshToken } = await generateTokens(user);

  const userResponse = user.toJSON();
  res.cookie("token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.status(201).json({
    msg: "Registro completado con éxito",
    user: userResponse,
  });
});

export const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const user = await User.findOne({
    email: email.toLowerCase().trim(),
  }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ msg: "Credenciales inválidas" });
  }

  const { accessToken, refreshToken } = await generateTokens(user);

  const userResponse = user.toJSON();
  res.cookie("token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({ user: userResponse });
});

export const getMe = (req, res) => {
  const { password: _, ...userWithoutPass } = req.user.toObject();
  res.json(userWithoutPass);
};

export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken: token } = req.cookies;

  if (!token) {
    return res.status(401).json({ msg: "Refresh token requerido" });
  }

  const decoded = jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
  );

  const storedToken = await RefreshToken.findOne({
    token,
    user: decoded.id,
    expiresAt: { $gt: new Date() },
  });

  if (!storedToken) {
    return res.status(401).json({ msg: "Refresh token inválido o expirado" });
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    return res.status(401).json({ msg: "Usuario no encontrado" });
  }

  const { accessToken, refreshToken: newRefreshToken } =
    await generateTokens(user);

  await RefreshToken.deleteOne({ _id: storedToken._id });

  res.cookie("token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ msg: "Token refrescado exitosamente" });
});

export const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (refreshToken) {
    await RefreshToken.deleteOne({ token: refreshToken });
  }

  res.clearCookie("token");
  res.clearCookie("refreshToken");

  res.json({ msg: "Logout exitoso" });
});

export const updateProfile = asyncHandler(async (req, res) => {
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
});
