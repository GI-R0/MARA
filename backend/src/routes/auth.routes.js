import { Router } from "express";
import {
  register,
  login,
  getMe,
  getUsers,
  updateUserRole,
  deleteUser,
  updateProfile,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import { protect, authorize } from "../middlewares/auth.js";
import {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} from "../validators/auth.validator.js";
import { loginLimiter, registerLimiter } from "../middlewares/rateLimiter.js";

const router = Router();

router.post("/register", registerLimiter, registerValidator, register);

router.post("/login", loginLimiter, loginValidator, login);
router.post("/forgot-password", forgotPasswordValidator, forgotPassword);
router.post("/reset-password", resetPasswordValidator, resetPassword);
router.get("/users", protect, authorize("admin"), getUsers);
router.put(
  "/users/:id",
  protect,
  authorize("admin"),
  updateUserRole,
);
router.delete("/users/:id", protect, authorize("admin"), deleteUser);

router.get("/me", protect, getMe);

router.post("/refresh", refreshToken);

router.post("/logout", logout);

router.put("/profile", protect, updateProfile);

export default router;
