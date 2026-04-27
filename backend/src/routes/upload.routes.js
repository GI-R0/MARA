import express from "express";
import { upload } from "../config/cloudinary.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

const validateFileSize = (req, res, next) => {
  const maxSize = 5 * 1024 * 1024;

  if (req.file && req.file.size > maxSize) {
    return res.status(413).json({
      msg: "El archivo es muy grande. Tamaño máximo: 5MB",
    });
  }
  next();
};

const validateFileType = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ msg: "No se ha subido ninguna imagen" });
  }

  const tiposPermitidos = ["image/jpeg", "image/png", "image/webp"];
  if (!tiposPermitidos.includes(req.file.mimetype)) {
    return res.status(415).json({
      msg: "Tipo de archivo no permitido. Usa: JPG, PNG o WebP",
    });
  }
  next();
};

router.post(
  "/",
  protect,
  upload.single("image"),
  validateFileSize,
  validateFileType,
  (req, res) => {
    res.json({
      url: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  },
);

export default router;
