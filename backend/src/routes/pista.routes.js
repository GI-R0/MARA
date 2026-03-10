import { Router } from "express";
import {
  getPistas,
  getPistaById,
  createPista,
  updatePista,
  deletePista,
  getPistasByClub,
  getEstadisticasClub,
} from "../controllers/pista.controller.js";
import { protect, authorize } from "../middlewares/auth.js";
import { pistaValidator, pistaUpdateValidator } from "../validators/pista.validator.js";
import { createPistaLimiter } from "../middlewares/rateLimiter.js";

const router = Router();

// GET - Rutas específicas primero (antes de :id)
router.get("/", getPistas);
router.get(
  "/estadisticas",
  protect,
  authorize("club", "admin"),
  getEstadisticasClub
);
router.get("/club/:clubId", protect, getPistasByClub);

// GET - Rutas genéricas después (por parámetro :id)
router.get("/:id", getPistaById);

// POST - Crear pista con validación y rate limiter
router.post(
  "/",
  protect,
  authorize("club", "admin"),
  createPistaLimiter,
  pistaValidator,
  createPista
);

// PUT - Actualizar pista con validación
router.put(
  "/:id",
  protect,
  authorize("club", "admin"),
  pistaUpdateValidator,
  updatePista
);

// DELETE - Eliminar pista
router.delete("/:id", protect, authorize("club", "admin"), deletePista);

export default router;
