import { body } from "express-validator";

export const registerValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage("El nombre solo puede contener letras y espacios"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("El email es inválido")
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage("El email no puede exceder 255 caracteres"),

  body("password")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres")
    .matches(/[A-Z]/)
    .withMessage("La contraseña debe incluir al menos una mayúscula")
    .matches(/[a-z]/)
    .withMessage("La contraseña debe incluir al menos una minúscula")
    .matches(/[0-9]/)
    .withMessage("La contraseña debe incluir al menos un número")
    .matches(/[@$!%*?&]/)
    .withMessage("La contraseña debe incluir un carácter especial (@$!%*?&)")
    .isLength({ max: 128 })
    .withMessage("La contraseña no puede exceder 128 caracteres"),
];

export const loginValidator = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("El email es inválido")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .isLength({ min: 1, max: 128 })
    .withMessage("Contraseña inválida"),
];
