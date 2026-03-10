import { Router } from "express";
import { register, login, getMe } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.js";
import { registerValidator, loginValidator } from "../validators/auth.validator.js";
import { loginLimiter, registerLimiter } from "../middlewares/rateLimiter.js";

const router = Router();

// POST - Registrar con rate limiter
router.post("/register", registerLimiter, registerValidator, register);

// POST - Login con rate limiter
router.post("/login", loginLimiter, loginValidator, login);

// GET - Obtener datos del usuario autenticado
router.get("/me", protect, getMe);

export default router;