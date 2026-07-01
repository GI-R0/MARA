import crypto from "crypto";
import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { sendMail } from "../config/mailer.js";

const generateResetToken = () => crypto.randomBytes(32).toString("hex");

const sendWelcomeEmail = async (user) => {
  try {
    await sendMail({
      to: user.email,
      subject: "Bienvenido a SportifyClub",
      html: `<p>Hola ${user.name},</p><p>Tu cuenta en SportifyClub ha sido creada correctamente.</p><p>Ya puedes reservar pistas y disfrutar de nuestro servicio.</p>`,
      text: `Hola ${user.name},\n\nTu cuenta en SportifyClub ha sido creada correctamente. Ya puedes reservar pistas y disfrutar de nuestro servicio.`,
    });
  } catch (err) {
    console.error("[WARN] No se pudo enviar el email de bienvenida:", err.message);
  }
};

const sendPasswordResetEmail = async (user, resetToken) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

  await sendMail({
    to: user.email,
    subject: "Recupera tu contraseña de SportifyClub",
    html: `<p>Hola ${user.name || "usuario"},</p>
      <p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
      <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
      <p><a href="${resetUrl}">Restablecer contraseña</a></p>
      <p>Si no solicitaste este cambio, ignora este correo.</p>`,
    text: `Hola ${user.name || "usuario"},\n\nHemos recibido una solicitud para restablecer tu contraseña. Usa este enlace para crear una nueva contraseña:\n${resetUrl}\n\nSi no solicitaste este cambio, ignora este correo.`,
  });
};

// Función helper para generar tokens
const generateTokens = async (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }, // Token de acceso corto
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: "7d", jwtid: crypto.randomBytes(8).toString("hex") },
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
      secure: true, // Siempre true en producción
      sameSite: "none", // Permite cross-origin
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

    sendWelcomeEmail(user).catch((err) =>
      console.error("[WARN] Error sending welcome email:", err.message),
    );
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
      secure: true, // Siempre true en producción
      sameSite: "none", // Permite cross-origin
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

export const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("name email role createdAt updatedAt")
      .sort({ createdAt: -1 });
    res.json({ users });
  } catch (err) {
    console.error("[ERROR] Get users:", err.message);
    res.status(500).json({ msg: "Error al obtener usuarios" });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;

    if (!role || !["user", "club", "admin"].includes(role)) {
      return res.status(400).json({ msg: "Rol inválido" });
    }

    if (req.user._id.toString() === userId) {
      return res.status(403).json({ msg: "No puedes cambiar tu propio rol" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true },
    ).select("name email role createdAt updatedAt");

    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    res.json({ user });
  } catch (err) {
    console.error("[ERROR] Update user role:", err.message);
    res.status(500).json({ msg: "Error al actualizar rol" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (req.user._id.toString() === userId) {
      return res.status(403).json({ msg: "No puedes eliminar tu propia cuenta" });
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    res.json({ msg: "Usuario eliminado correctamente" });
  } catch (err) {
    console.error("[ERROR] Delete user:", err.message);
    res.status(500).json({ msg: "Error al eliminar usuario" });
  }
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
      secure: true, // Siempre true en producción
      sameSite: "none", // Permite cross-origin
      path: "/",
    };

    res.cookie("token", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
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

export const forgotPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(200).json({
        msg: "Si el email existe, recibirás instrucciones para restablecer tu contraseña.",
      });
    }

    const resetToken = generateResetToken();
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.passwordResetToken = resetTokenHash;
    user.passwordResetExpires = Date.now() + 1000 * 60 * 60; // 1 hora
    await user.save({ validateBeforeSave: false });

    await sendPasswordResetEmail(user, resetToken);

    res.status(200).json({
      msg: "Si el email existe, recibirás instrucciones para restablecer tu contraseña.",
    });
  } catch (err) {
    console.error("[ERROR] Forgot password:", err.message);
    res
      .status(500)
      .json({ msg: "Error al procesar la solicitud", error: err.message });
  }
};

export const resetPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { token, password } = req.body;
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    }).select("+passwordResetToken +passwordResetExpires");

    if (!user) {
      return res.status(400).json({ msg: "Token inválido o expirado" });
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({ msg: "Contraseña restablecida correctamente" });
  } catch (err) {
    console.error("[ERROR] Reset password:", err.message);
    res.status(500).json({ msg: "Error al restablecer la contraseña" });
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

