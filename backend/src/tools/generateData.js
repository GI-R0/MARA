import { faker } from "@faker-js/faker";
import fs from "fs";
import path from "path";

function generateUsers(numUsers = 50) {
  const users = [];
  const roles = ["user", "club", "admin"];

  users.push({
    id: faker.string.uuid(),
    nombre: "Admin",
    apellido: "Sportify",
    email: "admin@sportify.com",
    password: "Admin123!",

    rol: "admin",
    telefono: "123456789",
    fechaRegistro: new Date(),
  });
  for (let i = 1; i < numUsers; i++) {
    users.push({
      id: faker.string.uuid(),
      nombre: faker.person.firstName(),
      apellido: faker.person.lastName(),
      email: faker.internet.email(),
      password: "Password123!",
      rol: faker.helpers.arrayElement(roles),
      telefono: faker.phone.number(),
      fechaRegistro: faker.date.past(),
    });
  }
  return users;
}

function generatePistas(numPistas = 50, clubIds) {
  const pistas = [];
  const deportes = ["Pádel", "Tenis", "Fútbol 5", "Baloncesto", "Voleibol"];
  const superficies = [
    "Moqueta",
    "Tierra batida",
    "Cemento",
    "Césped",
    "Sintética",
  ];
  for (let i = 0; i < numPistas; i++) {
    pistas.push({
      id: faker.string.uuid(),
      nombre: `Pista ${i + 1}`,
      deporte: faker.helpers.arrayElement(deportes),
      precioHora: faker.number.int({ min: 10, max: 50 }),
      ubicacion: faker.location.city(),
      clubId: faker.helpers.arrayElement(clubIds),
      imagen: "",
      iluminacion: faker.datatype.boolean(),
      superficie: faker.helpers.arrayElement(superficies),
    });
  }
  return pistas;
}

function generateReservas(numReservas = 50, userIds, pistaIds) {
  const reservas = [];
  for (let i = 0; i < numReservas; i++) {
    const fecha = faker.date.future();
    reservas.push({
      id: faker.string.uuid(),
      usuarioId: faker.helpers.arrayElement(userIds),
      pistaId: faker.helpers.arrayElement(pistaIds),
      fecha: fecha.toISOString().split("T")[0],
      horaInicio: faker.helpers.arrayElement([
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
      ]),
      duracion: faker.helpers.arrayElement([1, 2]),
      precioTotal: faker.number.int({ min: 10, max: 100 }),
      estado: faker.helpers.arrayElement([
        "pendiente",
        "confirmada",
        "cancelada",
      ]),
    });
  }
  return reservas;
}

const users = generateUsers(50);
const clubIds = users.filter((u) => u.rol === "club").map((u) => u.id);
const pistas = generatePistas(50, clubIds);
const userIds = users.map((u) => u.id);

const pistaIds = pistas.map((p) => p.id);

const reservas = generateReservas(50, userIds, pistaIds);

function writeCSV(filename, data, headers) {
  const csv = [headers.join(",")];
  data.forEach((item) => {
    const row = headers.map((h) => item[h] || "");
    csv.push(row.join(","));
  });
  fs.writeFileSync(path.join("data", filename), csv.join("\n"));
}

writeCSV("usuarios.csv", users, [
  "id",
  "nombre",
  "apellido",
  "email",
  "password",
  "rol",
  "telefono",
  "fechaRegistro",
]);
writeCSV("pistas.csv", pistas, [
  "id",
  "nombre",
  "deporte",
  "precioHora",
  "ubicacion",
  "clubId",
  "imagen",
  "iluminacion",
  "superficie",
]);
writeCSV("reservas.csv", reservas, [
  "id",
  "usuarioId",
  "pistaId",
  "fecha",
  "horaInicio",
  "duracion",
  "precioTotal",
  "estado",
]);

console.log("Datos generados y guardados en CSV.");
