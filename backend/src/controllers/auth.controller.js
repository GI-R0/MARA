import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

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
      role: role && ["user", "club", "admin"].includes(role) ? role : "user",
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const userResponse = user.toJSON();
    res.status(201).json({
      msg: "Registro completado con éxito",
      token,
      user: userResponse,
    });
  } catch (err) {
    console.error("[ERROR] Registering user:", err.message);
    res.status(500).json({ msg: "Error al registrar usuario", error: err.message });
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

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const userResponse = user.toJSON();
    res.json({ token, user: userResponse });
  } catch (err) {
    console.error("[ERROR] Login:", err.message);
    res.status(500).json({ msg: "Error del servidor", error: err.message });
  }
};

export const getMe = (req, res) => {
  const { password: _, ...userWithoutPass } = req.user.toObject();
  res.json(userWithoutPass);
};
