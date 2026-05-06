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
    const userMap = {}; // Diccionario para mapear email a ObjectId real
    for (const u of usuariosCSV) {
      const newUser = new User({
        name: u.name,
        email: u.email,
        password: u.password,
        role: u.role,
      });
      // save() ejecutará el middleware de mongoose para encriptar la password
      await newUser.save();
      userMap[u.email] = newUser._id;
    }

    console.log("Insertando Pistas...");
    const pistaMap = {}; // Diccionario para mapear nombre a ObjectId real
    const pistaPriceMap = {};
    const adminOrClubId = Object.values(userMap)[0]; // fallback
    for (const p of pistasCSV) {
      let horarios = [];
      try {
        horarios = JSON.parse(p.horariosDisponibles);
      } catch (e) {
        horarios = ["09:00", "10:00", "11:00", "12:00", "16:00", "17:00", "18:00"]; // Valor por defecto
      }

      const newPista = new Pista({
        nombre: p.nombre,
        deporte: p.deporte,
        precioHora: Number(p.precioHora),
        ubicacion: p.ubicacion,
        club: userMap[p.clubEmail] || adminOrClubId,
        imagen: p.imagen || undefined,
        iluminacion: p.iluminacion === "true",
        superficie: p.superficie,
        horariosDisponibles: horarios,
      });
      await newPista.save();
      pistaMap[p.nombre] = newPista._id;
      pistaPriceMap[p.nombre] = Number(p.precioHora);
    }

    console.log("Insertando Reservas...");
    const reservasList = [];
    for (const r of reservasCSV) {
      if (userMap[r.userEmail] && pistaMap[r.pistaNombre]) {
        const precioHora = pistaPriceMap[r.pistaNombre] || 10;
        reservasList.push({
          usuario: userMap[r.userEmail],
          pista: pistaMap[r.pistaNombre],
          fecha: new Date(r.fecha),
          hora: r.hora,
          duracion: Number(r.duracion),
          total: Number(r.duracion) * precioHora,
          estado: "confirmada", // default status if missing
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
