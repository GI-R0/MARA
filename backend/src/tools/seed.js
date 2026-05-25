import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Pista from "../models/Pista.js";
import Reserva from "../models/Reserva.js";

dotenv.config();

const deportes = ["Pádel", "Tenis", "Fútbol", "Fútbol 5", "Baloncesto", "Voleibol"];
const defaultImages = {
  "Pádel":
    "https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=800&q=80",
  "Tenis":
    "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80",
  "Fútbol 5":
    "https://images.unsplash.com/photo-1503596476-1b2f4b900358?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80&crop=entropy",
  "Fútbol":
    "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80",
  "Baloncesto":
    "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80",
  "Voleibol":
    "https://images.unsplash.com/photo-1592656094267-764a45160876?w=800&q=80",
  default:
    "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80",
};
const superficies = ["Moqueta", "Tierra batida", "Cemento", "Césped", "Hierba artificial"];
const horarios = ["09:00", "10:00", "11:00", "12:00", "16:00", "17:00", "18:00"];
const estados = ["pendiente", "confirmada", "cancelada"];
const nombres = [
  "Nico", "Emma", "Daniel", "Carla", "Luis", "Sofía", "Mateo", "Valeria",
  "Julián", "Gabriela", "Hugo", "Luna", "Marcelo", "Ariana", "Bruno",
  "Isabela", "Diego", "Clara", "Samuel", "Mía",
];
const ciudades = ["Nordberg", "Port Ruthe", "New Drew", "Claytonview", "Dennisland", "West Callieworth", "North Omar", "South Domingo"];

function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDateInFuture(days = 30) {
  const today = new Date();
  const future = new Date(today);
  future.setDate(today.getDate() + randomInt(1, days));
  future.setHours(0, 0, 0, 0);
  return future;
}

async function seedDatabase() {
  await connectDB();
  console.log("Conectado a MongoDB para seed...");

  await Reserva.deleteMany();
  await Pista.deleteMany();
  await User.deleteMany();

  const admin = await User.create({
    name: "Admin Sportify",
    email: "admin@sportify.com",
    password: "admin123",
    role: "admin",
  });

  const clubs = [];
  for (let i = 1; i <= 10; i++) {
    clubs.push({
      name: `Club ${i}`,
      email: `club${i}@sportify.com`,
      password: `club1234`,
      role: "club",
    });
  }
  const users = [];
  for (let i = 1; i <= 20; i++) {
    const name = randomChoice(nombres);
    users.push({
      name,
      email: `${name.toLowerCase()}${i}@sportify.com`,
      password: "user1234",
      role: "user",
    });
  }

  const createdClubs = await User.create(clubs);
  const createdUsers = await User.create(users);

  const pistasData = [];
  for (let i = 1; i <= 40; i++) {
    const deporte = randomChoice(deportes);
    pistasData.push({
      nombre: `Pista ${i}`,
      deporte,
      precioHora: randomInt(10, 50),
      ubicacion: randomChoice(ciudades),
      club: randomChoice(createdClubs)._id,
      horariosDisponibles: horarios,
      imagen: defaultImages[deporte] || defaultImages.default,
      iluminacion: Math.random() > 0.5,
      superficie: randomChoice(superficies),
    });
  }

  const createdPistas = await Pista.create(pistasData);

  const reservasData = [];
  for (let i = 1; i <= 60; i++) {
    const pista = randomChoice(createdPistas);
    const usuario = randomChoice(createdUsers);
    const fecha = randomDateInFuture(45);
    const hora = randomChoice(horarios);
    const duracion = randomChoice([1, 2, 3]);
    reservasData.push({
      usuario: usuario._id,
      pista: pista._id,
      fecha,
      hora,
      duracion,
      total: pista.precioHora * duracion,
      estado: randomChoice(estados),
    });
  }

  await Reserva.create(reservasData);

  console.log("Seed completado: usuarios, clubes, pistas y reservas cargados.");
  process.exit(0);
}

seedDatabase().catch((error) => {
  console.error("Error durante el seed:", error);
  process.exit(1);
});
