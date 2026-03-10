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
import { reservaValidator, reservaUpdateValidator } from "../validators/reserva.validator.js";
import { createReservaLimiter } from "../middlewares/rateLimiter.js";

const router = Router();

// GET - Todas las reservas (solo admin)
router.get("/", protect, authorize("admin"), getReservas);

// GET - Mis reservas (usuario autenticado)
router.get("/mis-reservas", protect, getMisReservas);

// GET - Reserva por ID
router.get("/:id", protect, getReservaById);

// POST - Crear reserva con validación y rate limiter
router.post("/", protect, createReservaLimiter, reservaValidator, createReserva);

// PUT - Actualizar reserva con validación
router.put("/:id", protect, reservaUpdateValidator, updateReserva);

// DELETE - Eliminar reserva
router.delete("/:id", protect, deleteReserva);

export default router;
