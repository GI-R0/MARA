import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Pista from '../models/Pista.js';
import Reserva from '../models/Reserva.js';

const reservaId = process.argv[2] || '6a149f05de5cd768f4dd1888';
const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sportify';

try {
  await mongoose.connect(uri);
  const reserva = await Reserva.findById(reservaId)
    .populate('usuario', 'name email role')
    .populate('pista', 'nombre deporte precioHora ubicacion superficie');

  if (!reserva) {
    console.error('Reserva no encontrada:', reservaId);
    process.exit(1);
  }

  console.log(JSON.stringify({
    id: reserva._id.toString(),
    usuario: reserva.usuario,
    pista: reserva.pista,
    fecha: reserva.fecha.toISOString().split('T')[0],
    hora: reserva.hora,
    duracion: reserva.duracion,
    total: reserva.total,
    estado: reserva.estado,
    createdAt: reserva.createdAt,
    updatedAt: reserva.updatedAt,
  }, null, 2));
  process.exit(0);
} catch (error) {
  console.error('ERROR', error.message);
  process.exit(1);
}
