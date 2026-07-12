export const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{8,128}$/;

export const PASSWORD_MESSAGE =
  "La contraseña debe tener entre 8 y 128 caracteres e incluir al menos una mayúscula, una minúscula, un número y un símbolo permitido (@ $ ! % * ? & . _ -).";

export const PASSWORD_RULES = [
  {
    id: "length",
    label: "Entre 8 y 128 caracteres",
    test: (password) => password.length >= 8 && password.length <= 128,
  },
  {
    id: "upper",
    label: "Al menos una mayúscula (A-Z)",
    test: (password) => /[A-Z]/.test(password),
  },
  {
    id: "lower",
    label: "Al menos una minúscula (a-z)",
    test: (password) => /[a-z]/.test(password),
  },
  {
    id: "number",
    label: "Al menos un número (0-9)",
    test: (password) => /\d/.test(password),
  },
  {
    id: "special",
    label: "Al menos un símbolo permitido (@ $ ! % * ? & . _ -)",
    test: (password) => /[@$!%*?&._-]/.test(password),
  },
  {
    id: "allowed",
    label: "Solo letras, números y símbolos permitidos",
    test: (password) => /^[A-Za-z\d@$!%*?&._-]*$/.test(password),
  },
];