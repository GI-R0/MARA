import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Pista from '../models/Pista.js';
import Reserva from '../models/Reserva.js';

try {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sportify';
  await mongoose.connect(uri);
  console.log('Connected to Mongo for test reserva');

  const admin = await User.findOne({ email: 'admin@sportify.com' });
  if (!admin) {
    console.error('Admin user not found');
    process.exit(1);
  }

  const pista = await Pista.findOne();
  if (!pista) {
    console.error('No pista found');
    process.exit(1);
  }

  const fecha = new Date();
  fecha.setDate(fecha.getDate() + 1);
  fecha.setHours(0,0,0,0);

  const hora = (pista.horariosDisponibles && pista.horariosDisponibles[0]) || '09:00';
  const duracion = 1;
  const total = pista.precioHora * duracion;

  const reserva = await Reserva.create({
    usuario: admin._id,
    pista: pista._id,
    fecha,
    hora,
    duracion,
    total,
    estado: 'confirmada',
  });

  console.log('Reserva creada:', reserva._id.toString());
  process.exit(0);
} catch (e) {
  console.error('ERR', e);
  process.exit(1);
}
