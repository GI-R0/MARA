import { Router } from "express";
import {
  getReservas,
  getReservaById,
  createReserva,
  updateReserva,
  deleteReserva,
  getMisReservas,
} from "../controllers/reserva.controller.js";
import { protect, authorize } from "../middlewares/auth.js";
import {
  reservaValidator,
  reservaUpdateValidator,
} from "../validators/reserva.validator.js";
import { createReservaLimiter } from "../middlewares/rateLimiter.js";

const router = Router();

router.get("/", protect, authorize("admin"), getReservas);

router.get("/mis-reservas", protect, getMisReservas);

router.get("/:id", protect, getReservaById);

router.post(
  "/",
  protect,
  createReservaLimiter,
  reservaValidator,
  createReserva,
);

router.put(
  "/:id",
  protect,
  createReservaLimiter,
  reservaUpdateValidator,
  updateReserva,
);

router.delete("/:id", protect, createReservaLimiter, deleteReserva);

export default router;
