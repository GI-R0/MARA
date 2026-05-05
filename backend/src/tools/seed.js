import fs from "fs";
import path from "path";
import csv from "csv-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";

import User from "../models/User.js";
import Pista from "../models/Pista.js";
import Reserva from "../models/Reserva.js";

dotenv.config();

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/sportifyclub";

async function readCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });
}

async function seedDatabase() {
  try {
    await mongoose.connect(uri);
    console.log("Conectado a MongoDB para hacer el seed...");

    console.log("Limpiando colecciones actuales...");
    await Reserva.deleteMany({});
    await Pista.deleteMany({});
    await User.deleteMany({});

    console.log("Leyendo archivos CSV...");
    // Ajustamos la ruta asumiendo que se ejecuta con `npm run seed` desde el directorio backend
    const dataDir = path.join(process.cwd(), "src", "data");
    const usuariosCSV = await readCSV(path.join(dataDir, "usuarios.csv"));
    const pistasCSV = await readCSV(path.join(dataDir, "pistas.csv"));
    const reservasCSV = await readCSV(path.join(dataDir, "reservas.csv"));

    console.log("Insertando Usuarios...");
    const userMap = {}; // Diccionario para mapear UUID falso a ObjectId real
    for (const u of usuariosCSV) {
      const newUser = new User({
        name: `${u.nombre} ${u.apellido}`,
        email: u.email,
        password: u.password,
        role: u.rol,
      });
      // save() ejecutará el middleware de mongoose para encriptar la password
      await newUser.save();
      userMap[u.id] = newUser._id;
    }

    console.log("Insertando Pistas...");
    const pistaMap = {}; // Diccionario para mapear UUID falso a ObjectId real
    const adminOrClubId = Object.values(userMap)[0]; // fallback
    for (const p of pistasCSV) {
      const newPista = new Pista({
        nombre: p.nombre,
        deporte: p.deporte,
        precioHora: Number(p.precioHora),
        ubicacion: p.ubicacion,
        club: userMap[p.clubId] || adminOrClubId,
        imagen: p.imagen || undefined,
        iluminacion: p.iluminacion === "true",
        superficie: p.superficie,
        horariosDisponibles: ["09:00", "10:00", "11:00", "12:00", "16:00", "17:00", "18:00"], // Valor por defecto
      });
      await newPista.save();
      pistaMap[p.id] = newPista._id;
    }

    console.log("Insertando Reservas...");
    const reservasList = [];
    for (const r of reservasCSV) {
      if (userMap[r.usuarioId] && pistaMap[r.pistaId]) {
        reservasList.push({
          usuario: userMap[r.usuarioId],
          pista: pistaMap[r.pistaId],
          fecha: new Date(r.fecha),
          hora: r.horaInicio,
          duracion: Number(r.duracion),
          total: Number(r.precioTotal),
          estado: r.estado,
        });
      }
    }
    // Para las reservas usamos insertMany por eficiencia, no tienen pre("save") crítico
    await Reserva.insertMany(reservasList);

    console.log(`¡Base de datos alimentada con éxito!`);
    console.log(`- ${usuariosCSV.length} usuarios`);
    console.log(`- ${pistasCSV.length} pistas`);
    console.log(`- ${reservasList.length} reservas`);
    
    process.exit(0);
  } catch (error) {
    console.error("Error durante el seed:", error);
    process.exit(1);
  }
}

seedDatabase();
