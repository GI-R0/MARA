# Modelos de Base de Datos

## User
- name: String, required
- email: String, unique, required
- password: String, required, select: false
- role: String, enum: ['user', 'club', 'admin'], default: 'user'

## Pista
- nombre: String, required
- deporte: String, enum: ['Pádel', 'Tenis', ...]
- precioHora: Number, required
- ubicacion: String
- club: ObjectId ref User, required
- imagen: String
- iluminacion: Boolean
- superficie: String

## Reserva
- usuario: ObjectId ref User, required
- pista: ObjectId ref Pista, required
- fecha: Date, required
- hora: String, required
- duracion: Number, default 1
- total: Number, required
- estado: String, enum: ['pendiente', 'confirmada', 'cancelada'], default 'pendiente'