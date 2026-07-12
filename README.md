# SportifyClub

Plataforma web para reservar pistas deportivas. Incluye autenticación JWT, roles de usuario, gestión de pistas y reservas, y paneles para clubs y administradores.

## Resumen

SportifyClub es una aplicación full-stack MERN pensada para gestionar reservas de instalaciones deportivas como pádel, tenis, fútbol 5, baloncesto o voleibol.

## Roles

- Usuario: busca pistas y realiza reservas.
- Club: publica y administra sus instalaciones.
- Admin: supervisa usuarios, pistas y actividad general.

## Funcionalidades

- Catálogo de pistas con búsqueda y filtros.
- Reservas con validaciones de disponibilidad.
- Registro, login y control de acceso por roles.
- Dashboards para clubs y administradores.
- Carga y gestión de imágenes con Cloudinary.
- Seguridad con JWT, rate limiting y validación de datos.

## Tecnologías

### Backend

- Node.js y Express.
- MongoDB y Mongoose.
- JWT, bcrypt, express-validator, express-rate-limit.
- Cloudinary, multer y nodemailer.

### Frontend

- React 19 y Vite.
- React Router.
- Axios.
- React Toastify.
- Lucide React.

## Estructura

```text
sportifyclub/
├── backend/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── data/
│       ├── middlewares/
│       ├── models/
│       ├── routes/
│       ├── tools/
│       └── validators/
├── frontend/
│   └── sportifyclub-frontend/
│       └── src/
│           ├── api/
│           ├── components/
│           ├── context/
│           ├── hooks/
│           ├── pages/
│           ├── reducers/
│           └── styles/
└── QUICK_START.txt
```

## Inicio rápido

### Requisitos

- Node.js 18 o superior.
- MongoDB 7 o superior.
- npm.

### Backend

```bash
cd backend
npm install
npm run seed
npm run dev
```

### Frontend

```bash
cd frontend/sportifyclub-frontend
npm install
npm run dev
```

### Acceso local

- Frontend: http://localhost:5173
- Backend: http://localhost:4000
- Admin: admin@sportify.com / Admin123!

## Configuración

### Variables de entorno backend

- `NODE_ENV=production`
- `CORS_ORIGIN=https://mara-frontend-production.up.railway.app`
- `MONGODB_URI=...`
- `JWT_SECRET=...`
- `JWT_REFRESH_SECRET=...`

### Variables de entorno frontend

- `VITE_API_URL=https://mara-production-7e59.up.railway.app/api`

## Despliegue

1. Conectar backend y frontend a Railway.
2. Configurar las variables de entorno anteriores.
3. Verificar que ambos despliegues terminen en estado correcto.
4. Comprobar `https://mara-production-7e59.up.railway.app/api/health`.
5. Abrir el frontend y probar el login de admin.

## Documentación adicional

- [Inicio rápido](QUICK_START.txt)

## Licencia

MIT.
