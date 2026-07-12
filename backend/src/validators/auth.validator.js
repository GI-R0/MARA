import { body } from "express-validator";

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{8,128}$/;
const PASSWORD_MESSAGE =
  "La contraseña debe tener entre 8 y 128 caracteres e incluir al menos una mayúscula, una minúscula, un número y un símbolo permitido (@ $ ! % * ? & . _ -).";

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
    .isLength({ min: 8, max: 128 })
    .withMessage(PASSWORD_MESSAGE)
    .matches(PASSWORD_REGEX)
    .withMessage(PASSWORD_MESSAGE),
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

export const forgotPasswordValidator = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("El email es inválido")
    .normalizeEmail(),
];

export const resetPasswordValidator = [
  body("token").notEmpty().withMessage("El token es obligatorio"),
  body("password")
    .isLength({ min: 8, max: 128 })
    .withMessage(PASSWORD_MESSAGE)
    .matches(PASSWORD_REGEX)
    .withMessage(PASSWORD_MESSAGE),
];
