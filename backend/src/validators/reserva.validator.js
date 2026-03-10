import { body } from 'express-validator';

export const reservaValidator = [
  body('pista')
    .trim()
    .notEmpty().withMessage('La pista es obligatoria')
    .isMongoId().withMessage('ID de pista inválido'),
  
  body('fecha')
    .notEmpty().withMessage('La fecha es obligatoria')
    .isISO8601().withMessage('La fecha debe estar en formato ISO8601 (YYYY-MM-DD)')
    .custom((value) => {
      const fechaSeleccionada = new Date(value);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      if (fechaSeleccionada < hoy) {
        throw new Error('No se pueden hacer reservas en fechas pasadas');
      }
      return true;
    }),
  
  body('hora')
    .trim()
    .notEmpty().withMessage('La hora es obligatoria')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Hora inválida. Usa formato HH:MM'),
  
  body('duracion')
    .optional()
    .isInt({ min: 1, max: 3 }).withMessage('La duración debe ser entre 1 y 3 horas'),
];

export const reservaUpdateValidator = [
  body('estado')
    .optional()
    .trim()
    .isIn(['pendiente', 'confirmada', 'cancelada']).withMessage('Estado inválido'),
  
  body('duracion')
    .optional()
    .isInt({ min: 1, max: 3 }).withMessage('La duración debe ser entre 1 y 3 horas'),
];
