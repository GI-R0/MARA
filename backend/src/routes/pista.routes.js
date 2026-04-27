import { Router } from "express";
import {
  getPistas,
  getPistaById,
  createPista,
  updatePista,
  deletePista,
  getPistasByClub,
  getEstadisticasClub,
  addRating,
  getRatings,
  updatePistaImage,
} from "../controllers/pista.controller.js";
import { protect, authorize } from "../middlewares/auth.js";
import {
  pistaValidator,
  pistaUpdateValidator,
  ratingValidator,
} from "../validators/pista.validator.js";
import { createPistaLimiter } from "../middlewares/rateLimiter.js";

const router = Router();

router.get("/", getPistas);
router.get(
  "/estadisticas",
  protect,
  authorize("club", "admin"),
  getEstadisticasClub,
);
router.get("/club/:clubId", protect, getPistasByClub);

router.get("/:id", getPistaById);

router.get("/:id/ratings", getRatings);

router.post(
  "/",
  protect,
  authorize("club", "admin"),
  createPistaLimiter,
  pistaValidator,
  createPista,
);

router.post("/:id/ratings", protect, ratingValidator, addRating);

router.put(
  "/:id",
  protect,
  authorize("club", "admin"),
  pistaUpdateValidator,
  updatePista,
);

router.post("/:id/imagen", protect, authorize("admin"), updatePistaImage);

router.delete("/:id", protect, authorize("club", "admin"), deletePista);

export default router;
