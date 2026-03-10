import { faker } from '@faker-js/faker';
import fs from 'fs';
import path from 'path';

// Función para generar usuarios
function generateUsers(numUsers = 30) {
  const users = [];
  const roles = ['user', 'club', 'admin'];
  // Agregar admin fijo
  users.push({
    nombre: 'Admin',
    apellido: 'Sportify',
    email: 'admin@sportify.com',
    password: 'admin123', // En producción, hashear
    rol: 'admin',
    telefono: '123456789',
    fechaRegistro: new Date()
  });
  for (let i = 1; i < numUsers; i++) {
    users.push({
      nombre: faker.person.firstName(),
      apellido: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      rol: faker.helpers.arrayElement(roles),
      telefono: faker.phone.number(),
      fechaRegistro: faker.date.past()
    });
  }
  return users;
}

// Función para generar pistas
function generatePistas(numPistas = 50, clubEmails) {
  const pistas = [];
  const deportes = ['Pádel', 'Tenis', 'Fútbol 5', 'Baloncesto', 'Voleibol'];
  const superficies = ['Moqueta', 'Tierra batida', 'Cemento', 'Césped', 'Sintética'];
  for (let i = 0; i < numPistas; i++) {
    pistas.push({
      nombre: `Pista ${i + 1}`,
      deporte: faker.helpers.arrayElement(deportes),
      precioHora: faker.number.int({ min: 10, max: 50 }),
      ubicacion: faker.location.city(),
      clubEmail: faker.helpers.arrayElement(clubEmails),
      imagen: '',
      iluminacion: faker.datatype.boolean(),
      superficie: faker.helpers.arrayElement(superficies)
    });
  }
  return pistas;
}

// Función para generar reservas
function generateReservas(numReservas = 20, userIds, pistaIds) {
  const reservas = [];
  for (let i = 0; i < numReservas; i++) {
    const fecha = faker.date.future();
    reservas.push({
      usuarioId: faker.helpers.arrayElement(userIds),
      pistaId: faker.helpers.arrayElement(pistaIds),
      fecha: fecha.toISOString().split('T')[0],
      horaInicio: faker.helpers.arrayElement(['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00']),
      duracion: faker.helpers.arrayElement([1, 2]),
      precioTotal: faker.number.int({ min: 10, max: 100 }),
      estado: faker.helpers.arrayElement(['pendiente', 'confirmada', 'cancelada'])
    });
  }
  return reservas;
}

// Generar datos
const users = generateUsers(30);
const clubEmails = users.filter(u => u.rol === 'club').map(u => u.email);
const pistas = generatePistas(50, clubEmails);
const userIds = users.map(u => u.email); // Asumiendo email como id único
const pistaIds = pistas.map(p => p.nombre); // Asumiendo nombre como id único

const reservas = generateReservas(20, userIds, pistaIds);

// Escribir a CSV
function writeCSV(filename, data, headers) {
  const csv = [headers.join(',')];
  data.forEach(item => {
    const row = headers.map(h => item[h] || '');
    csv.push(row.join(','));
  });
  fs.writeFileSync(path.join('data', filename), csv.join('\n'));
}

writeCSV('usuarios.csv', users, ['nombre', 'apellido', 'email', 'password', 'rol', 'telefono', 'fechaRegistro']);
writeCSV('pistas.csv', pistas, ['nombre', 'deporte', 'precioHora', 'ubicacion', 'clubEmail', 'imagen', 'iluminacion', 'superficie']);
writeCSV('reservas.csv', reservas, ['usuarioId', 'pistaId', 'fecha', 'horaInicio', 'duracion', 'precioTotal', 'estado']);

console.log('Datos generados y guardados en CSV.');