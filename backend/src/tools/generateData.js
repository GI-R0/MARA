import { faker } from "@faker-js/faker";
import fs from "fs";
import path from "path";

function generateUsers(numUsers = 50) {
  const users = [];
  const roles = ["user", "club", "admin"];

  users.push({
    name: "Admin Sportify",
    email: "admin@sportify.com",
    password: "admin123",
    role: "admin",
  });
  
  for (let i = 1; i < numUsers; i++) {
    users.push({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: "password123",
      role: faker.helpers.arrayElement(roles),
    });
  }
  return users;
}

function generatePistas(numPistas = 50, clubs) {
  const pistas = [];
  const deportes = ["Pádel", "Tenis", "Fútbol 5", "Baloncesto", "Voleibol"];
  const superficies = ["Moqueta", "Tierra batida", "Cemento", "Césped", "Madera"];
  
  for (let i = 0; i < numPistas; i++) {
    pistas.push({
      nombre: `Pista ${faker.word.adjective()} ${i + 1}`,
      deporte: faker.helpers.arrayElement(deportes),
      precioHora: faker.number.int({ min: 10, max: 50 }),
      ubicacion: faker.location.city(),
      clubEmail: faker.helpers.arrayElement(clubs).email,
      imagen: "",
      iluminacion: faker.datatype.boolean().toString(),
      superficie: faker.helpers.arrayElement(superficies),
      horariosDisponibles: JSON.stringify(["09:00", "10:00", "11:00", "12:00", "16:00", "17:00", "18:00"])
    });
  }
  return pistas;
}

function generateReservas(numReservas = 50, usersList, pistasList) {
  const reservas = [];
  for (let i = 0; i < numReservas; i++) {
    reservas.push({
      userEmail: faker.helpers.arrayElement(usersList).email,
      pistaNombre: faker.helpers.arrayElement(pistasList).nombre,
      fecha: faker.date.future().toISOString().split("T")[0],
      hora: faker.helpers.arrayElement(["09:00", "10:00", "11:00", "12:00", "16:00", "17:00", "18:00"]),
      duracion: faker.helpers.arrayElement([1, 2]),
    });
  }
  return reservas;
}

const users = generateUsers(50);
const clubs = users.filter((u) => u.role === "club");
if (clubs.length === 0) clubs.push(users[0]); // fallback
const pistas = generatePistas(50, clubs);
const reservas = generateReservas(50, users, pistas);

function writeCSV(filename, data, headers) {
  const csv = [headers.join(",")];
  data.forEach((item) => {
    const row = headers.map((h) => {
      let val = item[h] || "";
      if (typeof val === "string" && val.includes(",")) return `"${val}"`;
      return val;
    });
    csv.push(row.join(","));
  });
  const dir = path.join(process.cwd(), "src", "data");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, filename), csv.join("\n"));
}

writeCSV("usuarios.csv", users, ["name", "email", "password", "role"]);
writeCSV("pistas.csv", pistas, ["nombre", "deporte", "precioHora", "ubicacion", "clubEmail", "imagen", "iluminacion", "superficie", "horariosDisponibles"]);
writeCSV("reservas.csv", reservas, ["userEmail", "pistaNombre", "fecha", "hora", "duracion"]);

console.log("Datos generados y guardados en CSV compatibles con seed.js.");
