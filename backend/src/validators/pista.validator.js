import { body } from 'express-validator';

export const pistaValidator = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre de la pista es obligatorio')
    .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres'),
  
  body('precioHora')
    .isFloat({ min: 0.5, max: 1000 }).withMessage('El precio debe estar entre €0.50 y €1000'),
  
  body('deporte')
    .trim()
    .isIn(['Pádel', 'Tenis', 'Fútbol', 'Fútbol 5', 'Baloncesto', 'Voleibol'])
    .withMessage('Deporte inválido. Opciones: Pádel, Tenis, Fútbol, Fútbol 5, Baloncesto, Voleibol'),
  
  body('ubicacion')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 }).withMessage('La ubicación debe tener entre 3 y 200 caracteres'),
  
  body('horariosDisponibles')
    .isArray({ min: 1 }).withMessage('Debe haber al menos un horario disponible'),
  
  body('horariosDisponibles.*')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Formato de horario inválido. Usa formato HH:MM (ej: 09:00)'),
  
  body('imagen')
    .optional()
    .trim()
    .isURL().withMessage('La URL de la imagen no es válida'),
  
  body('iluminacion')
    .optional()
    .isBoolean().withMessage('La iluminación debe ser verdadero o falso'),
  
  body('superficie')
    .optional()
    .trim()
    .isIn(['Césped', 'Arcilla', 'Cemento', 'Hierba artificial', 'Madera', 'Moqueta', 'Tierra batida'])
    .withMessage('Superficie inválida'),
];

export const pistaUpdateValidator = pistaValidator;
