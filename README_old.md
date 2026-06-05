# 🎾 SportifyClub - Plataforma de Reserva de Pistas Deportivas

> Una aplicación web completa para reservar pistas deportivas. Full-stack MERN con autenticación JWT, roles de usuario y gestión completa de reservas.

![Estado](https://img.shields.io/badge/estado-funcionando-brightgreen)
![Versión](https://img.shields.io/badge/versión-1.0.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18+-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-7+-green)
![License](https://img.shields.io/badge/license-MIT-yellow)

## 🎯 ¿Qué es SportifyClub?

SportifyClub es una **plataforma web completa** para la reserva de instalaciones deportivas. Similar a Booking.com pero especializado en pistas deportivas (pádel, tenis, fútbol, baloncesto, etc.).

### 👥 Perfiles de Usuario

1. **🏃‍♂️ Jugadores (Users)**: Usuarios normales que buscan y reservan pistas
2. **🏢 Clubes Deportivos (Clubs)**: Administradores que publican y gestionan sus instalaciones
3. **👑 Administradores (Admins)**: Supervisores del sistema con acceso total

### ✨ Funcionalidades Principales

- **🔍 Catálogo de Pistas**: Búsqueda y filtrado por deporte, ubicación, precio
- **📅 Sistema de Reservas**: Reserva en tiempo real con validaciones
- **👤 Gestión de Usuarios**: Registro, login, perfiles con roles
- **📊 Dashboards**: Estadísticas para clubs y administradores
- **🖼️ Gestión de Imágenes**: Upload de fotos de pistas (Cloudinary)
- **🔒 Seguridad**: JWT, rate limiting, validaciones completas

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+
- MongoDB 7+
- npm o yarn

### Instalación

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/GI-R0/SPORTS.git
   cd sportifyclub
   ```

2. **Backend**

   ```bash
   cd backend
   npm install
   # Configurar .env (ver .env.example)
   npm run seed  # Para cargar datos iniciales
   npm run dev
   ```

3. **Frontend**
   ```bash
   cd ../frontend/sportifyclub-frontend
   npm install
   # Configurar .env (ver .env.example)
   npm run dev
   ```

### Acceso

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:4000
- **Admin**: admin@sportify.com / admin123

## 📁 Estructura del Proyecto

```
sportifyclub/
├── backend/          # 🖥️ API REST (Node.js + Express)
├── frontend/         # 🌐 Interfaz React
├── docs/             # 📚 Documentación completa
├── QUICK_START.txt   # Inicio rápido
└── CHECKLIST_ENTREGA.txt  # Checklist de entrega
```

## 📚 Documentación

- [Documentación Completa](docs/README_COMPLETO.md) - Detalles técnicos, arquitectura, API
- [Backend](backend/README.md) - Configuración y uso del backend
- [Frontend](frontend/README.md) - Configuración y uso del frontend

## 🛠️ Tecnologías

- **Backend**: Node.js, Express, MongoDB, JWT, Cloudinary
- **Frontend**: React, Vite, Tailwind CSS, Axios
- **Herramientas**: ESLint

## 📧 Contacto

Para soporte o preguntas: [Tu email]

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE) para más detalles.

- **📱 Responsive**: Diseño móvil-first

---

## 🏗️ Arquitectura General

```
┌─────────────────────────────────────────────────────────────┐
│                    🌐 FRONTEND (React/Vite)                 │
│                    Port: 5173                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  📱 Páginas: Home, Pistas, Login, Register, etc.    │    │
│  │  🧩 Componentes: CardPista, ReservaForm, Navbar     │    │
│  │  🎣 Hooks: useAuth, useFetch, useFormValidation     │    │
│  │  📦 Context: AuthContext, ReservaContext            │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTP + JWT
                      │
         ┌────────────▼─────────────────────────────────────┐
         │         🖥️ BACKEND (Node.js/Express)             │
         │         Port: 4000                              │
         │  ┌─────────────────────────────────────────┐    │
         │  │  🛣️ Rutas: /api/auth, /api/pistas, etc. │    │
         │  │  🎮 Controladores: lógica de negocio      │    │
         │  │  ✅ Validadores: express-validator        │    │
         │  │  🛡️ Middlewares: auth, rate limiting     │    │
         └─────────────────────────────────────────┘    │
         └─────────────────────┬────────────────────────────┘
                               │ MongoDB Driver
                               │
         ┌─────────────────────▼────────────────────────────┐
         │              🗄️ MONGODB (Atlas/Local)             │
         │  ┌─────────────────────────────────────────┐    │
         │  │  👥 users: autenticación y roles        │    │
         │  │  🎾 pistas: instalaciones deportivas     │    │
         │  │  📅 reservas: bookings de pistas         │    │
         │  └─────────────────────────────────────────┘    │
         └──────────────────────────────────────────────────┘
```

### 🔄 Flujo de Datos Típico

```
1. Usuario abre app → AuthContext verifica localStorage
2. Navega a /pistas → GET /api/pistas
3. Selecciona pista → GET /api/pistas/:id
4. Hace reserva → POST /api/reservas (con JWT)
5. Backend valida token → crea Reserva + actualiza Pista
6. Frontend muestra confirmación → redirige a /mis-reservas
```

---

## 🛠️ Tecnologías

### Frontend

- **React 18** - Framework UI con hooks modernos
- **Vite** - Build tool ultra-rápido
- **Axios** - Cliente HTTP con interceptores
- **Context API** - Estado global (sin Redux)
- **CSS Vanilla** - Estilos con variables CSS
- **React Router** - Navegación SPA

### Backend

- **Node.js 18+** - Runtime JavaScript
- **Express.js** - Framework web minimalista
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación stateless
- **bcrypt** - Hashing de contraseñas
- **express-validator** - Validación de inputs
- **express-rate-limit** - Protección contra abuso
- **CORS** - Control de origen cruzado

### DevOps & Tools

- **Cloudinary** - Gestión de imágenes
- **Morgan** - Logging HTTP
- **Dotenv** - Variables de entorno
- **Nodemon** - Auto-restart en desarrollo

---

## 🚀 Instalación y Configuración

### Prerrequisitos

- **Node.js 18+**
- **MongoDB** (local o Atlas)
- **Git**

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/GI-R0/SPORTS.git
cd SPORTS/sportifyclub
```

### Paso 2: Configurar Backend

```bash
cd backend

# Instalar dependencias
npm install

# Crear archivo de variables de entorno
cp .env.example .env
```

**Contenido de `backend/.env`:**

```env
# Puerto del servidor
PORT=4000

# Base de datos MongoDB
MONGODB_URI=mongodb://localhost:27017/sportifyclub
# O para MongoDB Atlas:
# MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/sportifyclub

# JWT Secret (cambiar en producción)
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui_123456789

# URL del frontend (para CORS)
FRONTEND_URL=http://localhost:5173

# Cloudinary (opcional - para subir imágenes)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

### Paso 3: Configurar Frontend

```bash
cd ../frontend/sportifyclub-frontend

# Instalar dependencias
npm install

# Crear archivo de variables de entorno
echo "VITE_API_URL=http://localhost:4000/api" > .env
```

### Paso 4: Iniciar MongoDB

**Opción A: MongoDB Local**

```bash
# En Windows con MongoDB instalado
mongod

# O con Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Opción B: MongoDB Atlas**

- Crea cuenta en [MongoDB Atlas](https://cloud.mongodb.com/)
- Crea un cluster gratuito
- Copia la connection string al `.env`

### Paso 5: Poblar Base de Datos (Opcional)

```bash
cd backend
npm run seed
```

Esto crea:

- **30 usuarios** (5 clubs, 25 players)
- **30 pistas** deportivas
- **100 reservas** de ejemplo

### Paso 6: Ejecutar la Aplicación

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
# Servidor en http://localhost:4000
```

**Terminal 2 - Frontend:**

```bash
cd frontend/sportifyclub-frontend
npm run dev
# App en http://localhost:5173
```

---

## 📊 Modelos de Datos

SportifyClub utiliza **MongoDB** con **3 colecciones principales** relacionadas.

### 1. 👥 Users (Usuarios)

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  name: "Juan García",
  email: "juan@example.com",
  password: "$2a$10$...", // Hasheado con bcrypt
  role: "user", // "user" | "club" | "admin"
  createdAt: "2026-03-05T10:00:00.000Z",
  updatedAt: "2026-03-05T10:00:00.000Z"
}
```

**Campos:**

- `name`: String (2-50 chars, solo letras)
- `email`: String (único, validado)
- `password`: String (8+ chars, con mayúscula, minúscula, número, símbolo)
- `role`: Enum ["user", "club", "admin"]

### 2. 🎾 Pistas (Instalaciones Deportivas)

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439012"),
  nombre: "Pista Central",
  deporte: "Pádel",
  precioHora: 25,
  ubicacion: "Calle Principal 123",
  club: ObjectId("507f1f77bcf86cd799439011"), // → User (club)
  horariosDisponibles: ["09:00", "10:00", "11:00", "12:00"],
  superficie: "Cemento",
  iluminacion: true,
  imagen: "https://cloudinary.com/.../pista.jpg",
  createdAt: "2026-03-05T10:00:00.000Z",
  updatedAt: "2026-03-05T10:00:00.000Z"
}
```

**Campos:**

- `nombre`: String (3-100 chars)
- `deporte`: Enum ["Pádel", "Tenis", "Fútbol", "Fútbol 5", "Baloncesto", "Voleibol"]
- `precioHora`: Number (0.50-1000)
- `ubicacion`: String (opcional, 3-200 chars)
- `club`: ObjectId → User (requerido)
- `horariosDisponibles`: Array<String> (HH:MM format)
- `superficie`: Enum (opcional)
- `iluminacion`: Boolean (default: false)
- `imagen`: String (URL, default: placeholder)

### 3. 📅 Reservas (Bookings)

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439013"),
  usuario: ObjectId("507f1f77bcf86cd799439014"), // → User (jugador)
  pista: ObjectId("507f1f77bcf86cd799439012"),  // → Pista
  fecha: "2026-03-10",
  hora: "10:00",
  duracion: 2,
  total: 50,
  estado: "confirmada", // "pendiente" | "confirmada" | "cancelada"
  createdAt: "2026-03-05T10:00:00.000Z",
  updatedAt: "2026-03-05T10:00:00.000Z"
}
```

**Campos:**

- `usuario`: ObjectId → User (requerido)
- `pista`: ObjectId → Pista (requerido)
- `fecha`: Date (YYYY-MM-DD)
- `hora`: String (HH:MM format)
- `duracion`: Number (1-3 horas)
- `total`: Number (calculado: precioHora × duracion)
- `estado`: Enum ["pendiente", "confirmada", "cancelada"]

### 🔗 Relaciones

```
User (club) ───1:N───→ Pista
                      │
                      └──1:N───→ Reserva ←───N:1─── User (jugador)
```

**Índices Optimizados:**

- `users.email`: único para login rápido
- `pistas.club`: para filtrar pistas por club
- `reservas.pista + reservas.fecha + reservas.hora`: compuesto único
- `reservas.usuario`: para "mis reservas"

---

## 🔌 API REST

Base URL: `http://localhost:4000/api`

### Autenticación

```
POST   /auth/register          → Crear cuenta
POST   /auth/login             → Login
GET    /auth/me               → Datos usuario actual (requiere JWT)
```

### Pistas

```
GET    /pistas                 → Todas las pistas
GET    /pistas/:id             → Detalles de pista
GET    /pistas/estadisticas    → Dashboard club (club/admin)
GET    /pistas/club/:clubId    → Pistas de un club
POST   /pistas                 → Crear pista (club/admin)
PUT    /pistas/:id             → Editar pista (club/admin)
DELETE /pistas/:id             → Eliminar pista (club/admin)
```

### Reservas

```
GET    /reservas               → Todas las reservas (admin)
GET    /reservas/mis-reservas  → Mis reservas (autenticado)
GET    /reservas/:id           → Detalles reserva
POST   /reservas               → Crear reserva (autenticado)
PUT    /reservas/:id           → Actualizar reserva (owner/admin)
DELETE /reservas/:id           → Cancelar reserva (owner/admin)
```

### Headers Requeridos

```javascript
// Para rutas protegidas
Authorization: Bearer <jwt_token>

// Content-Type para POST/PUT
Content-Type: application/json
```

### Ejemplos de Requests

**Crear Reserva:**

```bash
POST /api/reservas
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "pista": "507f1f77bcf86cd799439012",
  "fecha": "2026-03-15",
  "hora": "10:00",
  "duracion": 2
}
```

**Crear Pista (Club):**

```bash
POST /api/pistas
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "nombre": "Pista Azul",
  "deporte": "Pádel",
  "precioHora": 25,
  "ubicacion": "Centro Deportivo Madrid",
  "horariosDisponibles": ["09:00", "10:00", "11:00", "12:00"],
  "superficie": "Cemento",
  "iluminacion": true
}
```

---

## 🔐 Autenticación y Roles

### Sistema JWT

**Flujo de Autenticación:**

```
1. Usuario hace POST /auth/login con email/password
2. Backend valida credenciales
3. Retorna JWT con payload: { id, role, iat, exp }
4. Frontend guarda token en localStorage
5. Cada request incluye: Authorization: Bearer <token>
6. Backend verifica token en middleware 'protect'
```

**Payload del JWT:**

```json
{
  "id": "507f1f77bcf86cd799439011",
  "role": "club",
  "iat": 1646476800,
  "exp": 1646563200
}
```

### Middlewares de Seguridad

**`protect`** - Verifica autenticación

```javascript
// Solo usuarios logueados
router.get("/mis-reservas", protect, getMisReservas);
```

**`authorize(...roles)`** - Verifica permisos

```javascript
// Solo clubs y admins
router.post("/pistas", protect, authorize("club", "admin"), createPista);
```

### Matriz de Permisos

| Acción                 | User | Club | Admin |
| ---------------------- | ---- | ---- | ----- |
| Ver pistas             | ✅   | ✅   | ✅    |
| Ver detalle pista      | ✅   | ✅   | ✅    |
| Buscar/filtrar pistas  | ✅   | ✅   | ✅    |
| Hacer reserva          | ✅   | ✅   | ✅    |
| Ver mis reservas       | ✅   | ✅   | ✅    |
| Cancelar mi reserva    | ✅   | ✅   | ✅    |
| Crear pista            | ❌   | ✅   | ✅    |
| Editar mi pista        | ❌   | ✅   | ✅    |
| Eliminar mi pista      | ❌   | ✅   | ✅    |
| Ver dashboard club     | ❌   | ✅   | ✅    |
| Ver todas las reservas | ❌   | ❌   | ✅    |
| Gestionar usuarios     | ❌   | ❌   | ✅    |

### Rate Limiting

```javascript
// Login: 5 intentos cada 15 minutos
loginLimiter;

// Registro: 3 cuentas cada hora
registerLimiter;

// API general: 30 requests por minuto
apiLimiter;

// Crear pistas: 10 por hora
createPistaLimiter;

// Crear reservas: 20 por hora
createReservaLimiter;
```

---

## 🔄 Flujo de la Aplicación

### Flujo de Reserva (Usuario)

```
1. Usuario navega a /pistas
2. Ve catálogo con filtros (deporte, búsqueda)
3. Clica en CardPista → va a /pistas/:id
4. Ve detalles + ReservaForm
5. Selecciona fecha, hora, duración
6. Frontend valida:
   - Fecha no pasada
   - Hora en horariosDisponibles
   - Duración 1-3 horas
7. Envía POST /reservas
8. Backend:
   - Valida JWT
   - Verifica pista existe
   - Verifica horario disponible
   - Crea transacción MongoDB:
     a. Inserta Reserva
     b. Remueve hora de horariosDisponibles
   - Si error: rollback completo
9. Retorna reserva creada
10. Frontend muestra éxito → redirige a /mis-reservas
```

### Flujo de Gestión (Club)

```
1. Club se registra con role: "club"
2. Va a /gestion-pistas
3. Clica "Crear Pista"
4. Rellena formulario con validaciones
5. Envía POST /pistas
6. Backend:
   - Valida JWT y role
   - Valida campos con express-validator
   - Crea Pista con club: req.user._id
7. Pista aparece en catálogo público
8. Club puede editar/eliminar sus pistas
9. Dashboard muestra estadísticas
```

---

## 📁 Estructura del Proyecto

```
sportifyclub/
├── 📄 README.md                    # Este archivo
├── 📄 QUICK_START.txt             # Inicio rápido
├── 📄 CHECKLIST_ENTREGA.txt       # Checklist de entrega
├── 📄 CORREO_ENTREGA.txt          # Instrucciones de entrega
├── 📄 RESUM_ENTREGA.txt         # Resumen del proyecto
│
├── backend/                       # 🖥️ API REST
│   ├── 📄 package.json
│   ├── 📄 README.md
│   ├── src/
│   │   ├── 📄 app.js              # Config Express + rutas
│   │   ├── config/
│   │   │   ├── 📄 db.js           # Conexión MongoDB
│   │   │   └── 📄 cloudinary.js   # Config Cloudinary
│   │   ├── controllers/           # 🎮 Lógica de negocio
│   │   │   ├── 📄 auth.controller.js
│   │   │   ├── 📄 pista.controller.js
│   │   │   └── 📄 reserva.controller.js
│   │   ├── middlewares/           # 🛡️ Seguridad
│   │   │   ├── 📄 auth.js         # JWT + roles
│   │   │   └── 📄 rateLimiter.js  # Rate limiting
│   │   ├── models/                # 📊 Schemas MongoDB
│   │   │   ├── 📄 User.js
│   │   │   ├── 📄 Pista.js
│   │   │   └── 📄 Reserva.js
│   │   ├── routes/                # 🛣️ Endpoints API
│   │   │   ├── 📄 auth.routes.js
│   │   │   ├── 📄 pista.routes.js
│   │   │   └── 📄 reserva.routes.js
│   │   ├── seed/                  # 🌱 Datos iniciales
│   │   │   ├── 📄 seed.js
│   │   │   └── 📄 README.md
│   │   └── tools/                 # 🔧 Utilidades
│   └── data/                      # 📊 Datos CSV
│       ├── 📄 usuarios.csv
│       ├── 📄 pistas.csv
│       └── 📄 reservas.csv
│
└── frontend/                      # 🌐 Interfaz React
    ├── 📄 README.md
    ├── 📄 package.json
    ├── 📄 vite.config.js
    ├── 📄 index.html
    ├── public/
    │   └── images/
    ├── src/
    │   ├── 📄 main.jsx         # Entrada React
    │   ├── 📄 App.jsx          # Rutas SPA
    │   ├── api/
    │   │   └── 📄 axiosConfig.js # Cliente HTTP
    │   ├── components/         # 🧩 UI reutilizable
    │   │   ├── 📄 CardPista.jsx
    │   │   ├── 📄 ReservaForm.jsx
    │   │   ├── 📄 Navbar.jsx
    │   │   └── 📄 Footer.jsx
    │   ├── context/            # 📦 Estado global
    │   │   ├── 📄 AuthContext.jsx
    │   │   └── 📄 ReservaContext.jsx
    │   ├── hooks/              # 🎣 Lógica reutilizable
    │   │   ├── 📄 useAuth.js
    │   │   ├── 📄 useFetch.js
    │   │   └── 📄 useFormValidation.js
    │   ├── pages/              # 📱 Vistas principales
    │   │   ├── 📄 Home.jsx
    │   │   ├── 📄 Pistas.jsx
    │   │   ├── 📄 Login.jsx
    │   │   ├── 📄 Register.jsx
    │   │   ├── 📄 MisReservas.jsx
    │   │   └── 📄 GestionPistas.jsx
    │   ├── reducers/           # 🔄 Estado complejo
    │   │   └── 📄 reservaReducer.js
    │   └── styles/             # 🎨 CSS modular
    │       ├── 📄 styles.css    # Variables globales
    │       ├── 📄 Pistas.css
    │       └── 📄 ReservaForm.css
    └── scripts/                # 🔧 Utilidades frontend
        └── 📄 fetchPistas.js
```

---

## 🏛️ Decisiones Técnicas

### Por qué MERN Stack?

- **MERN** (MongoDB, Express, React, Node.js) es un stack completo JavaScript
- Misma sintaxis en frontend y backend
- Comunidad enorme y documentación abundante
- Ideal para prototipos rápidos y MVPs

### Por qué No Redux?

- **Context API + useReducer** suficiente para la complejidad actual
- Menos boilerplate que Redux
- Mejor performance para apps pequeñas/medianas
- Hooks modernos hacen el estado local más poderoso

### Por qué JWT en lugar de sesiones?

- **Stateless**: No necesito guardar sesiones en DB
- **Escalable**: Fácil de distribuir en múltiples servidores
- **API-first**: Perfecto para SPAs modernas
- **Mobile-ready**: Apps móviles pueden usar los mismos tokens

### Por qué MongoDB?

- **Esquemas flexibles**: Pistas pueden tener campos variables
- **Relaciones**: Population para joins eficientes
- **JSON-like**: Natural con JavaScript
- **Atlas gratuito**: Fácil de usar en desarrollo

### Arquitectura de Validación

- **Backend**: express-validator (robusto, sanitización automática)
- **Frontend**: Validación en tiempo real + hooks personalizados
- **Database**: Mongoose validation (última línea de defensa)

### Seguridad Implementada

- **Password hashing**: bcrypt con salt rounds
- **Rate limiting**: Protección contra brute force y spam
- **Input sanitization**: express-validator limpia datos
- **CORS**: Control de orígenes permitidos
- **JWT expiration**: Tokens expiran en 7 días
- **Role-based access**: Control granular de permisos

---

---

## 🚀 Despliegue

### Backend (Railway/Heroku/Render)

```bash
# 1. Configurar variables de entorno
MONGODB_URI=mongodb+srv://...
JWT_SECRET=tu_secret_seguro
FRONTEND_URL=https://tu-frontend.vercel.app
NODE_ENV=production

# 2. Deploy
git push heroku main
# o usar dashboard de Railway/Render
```

### Frontend (Vercel/Netlify)

```bash
# 1. Build
npm run build

# 2. Configurar environment variables
VITE_API_URL=https://tu-backend.herokuapp.com/api

# 3. Deploy
vercel --prod
# o conectar repo a Netlify
```

### Variables de Producción

```env
# Backend
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=very_long_random_string_here
FRONTEND_URL=https://tu-dominio.com
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Frontend
VITE_API_URL=https://tu-backend.com/api
```

---

## 🤝 Contribución

¡Las contribuciones son bienvenidas! 🎉

### Proceso

1. **Fork** el proyecto
2. **Crea** una rama: `git checkout -b feature/nueva-funcionalidad`
3. **Commit** cambios: `git commit -m 'Añade nueva funcionalidad'`
4. **Push** a la rama: `git push origin feature/nueva-funcionalidad`
5. **Abre** un Pull Request

### Guías de Código

- **ESLint**: Seguir reglas de linting
- **Commits**: Usar conventional commits
- **PRs**: Descripción clara + screenshots si aplica
- **Calidad**: Revisar funcionalidad y documentación

### Áreas de Mejora

- [ ] Notificaciones por email
- [ ] Sistema de ratings para pistas
- [ ] Integración con Stripe para pagos
- [ ] App móvil React Native
- [ ] API GraphQL
- [ ] Cache con Redis
- [ ] CI/CD con GitHub Actions

---

## 📄 Licencia

Este proyecto está bajo la **Licencia MIT**. Ver archivo `LICENSE` para más detalles.

---

## 🙏 Agradecimientos

- **React** y **Vite** por el desarrollo frontend moderno
- **MongoDB Atlas** por la base de datos gratuita
- **Express** por el framework backend robusto
- **La comunidad open source** por las librerías increíbles

---

## 📞 Contacto

¿Preguntas o sugerencias?

- **GitHub Issues**: [Abrir issue](https://github.com/GI-R0/SPORTS/issues)
- **Email**: Tu email aquí
- **LinkedIn**: Tu perfil

---

## 🎯 Checklist de Entrega

- [x] **Backend funcional** con API REST completa
- [x] **Frontend responsive** con React + Vite
- [x] **Base de datos** MongoDB con 3 colecciones relacionadas
- [x] **Autenticación JWT** con 3 roles de usuario
- [x] **Validaciones** completas en frontend y backend
- [x] **Rate limiting** y seguridad implementada
- [x] **README completo** con instalación y uso
- [x] **Deploy ready** para producción

---

_**SportifyClub** - Hecho con ❤️ para amantes del deporte y la tecnología_

⭐ **Si te gusta el proyecto, dale una estrella en GitHub!** ⭐

---

_Última actualización: Marzo 2026_
