import { Router } from "express";
import {
  register,
  login,
  getMe,
  updateProfile,
  refreshToken,
  logout,
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.js";
import {
  registerValidator,
  loginValidator,
} from "../validators/auth.validator.js";
import { loginLimiter, registerLimiter } from "../middlewares/rateLimiter.js";

const router = Router();

router.post("/register", registerLimiter, registerValidator, register);

router.post("/login", loginLimiter, loginValidator, login);

router.get("/me", protect, getMe);

router.post("/refresh", refreshToken);

router.post("/logout", logout);

router.put("/profile", protect, updateProfile);

export default router;
