# 🎾 SportifyClub - Plataforma de Reserva de Pistas Deportivas

> Una aplicación web completa para reservar pistas deportivas. Full-stack MERN con autenticación JWT, roles de usuario y gestión completa de reservas.

![Estado](https://img.shields.io/badge/estado-funcionando-brightgreen)
![Versión](https://img.shields.io/badge/versión-1.0.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18+-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-7+-green)
![License](https://img.shields.io/badge/license-MIT-yellow)

## 🎯 ¿Qué es SportifyClub?

SportifyClub es una **plataforma web completa** para la reserva de instalaciones deportivas. Similar a Booking.com pero especializado en pistas deportivas (pádel, tenis, fútbol 5, baloncesto, voleibol, etc.).

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
   git clone https://github.com/GI-R0/MARA.git
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

### Acceso Local

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:4000
- **Admin**: admin@sportify.com / Admin123!

### Acceso Desplegado (Producción)

- **Frontend**: https://mara-frontend-production.up.railway.app
- **Backend**: https://mara-production-7e59.up.railway.app/api

> ⚠️ **IMPORTANTE**: Si el despliegue no funciona, ver [`RAILWAY_FIX_CHECKLIST.md`](RAILWAY_FIX_CHECKLIST.md) para configuración de variables de entorno

## 📁 Estructura del Proyecto

```
SPORTS/
├── backend/          # 🖥️ API REST (Node.js + Express)
│   ├── src/
│   │   ├── config/       # Conexión DB, Cloudinary, Mailer
│   │   ├── controllers/  # Lógica de negocio
│   │   ├── models/       # Modelos MongoDB
│   │   ├── routes/       # Definición de rutas
│   │   ├── middlewares/  # Middlewares personalizados
│   │   ├── validators/   # Validaciones de entrada
│   │   ├── data/         # Archivos CSV para seeding
│   │   └── tools/        # Scripts de utilidad y seed.js
├── frontend/         # 🌐 Interfaz React
│   └── sportifyclub-frontend/
│       ├── public/          # Assets estáticos
│       ├── scripts/         # Scripts de utilidades
│       └── src/
│           ├── api/         # Configuración Axios
│           ├── components/  # Componentes reutilizables
│           ├── context/     # Contextos React
│           ├── hooks/       # Hooks personalizados
│           ├── pages/       # Páginas principales
│           ├── reducers/    # Reducers (reservaReducer)
│           └── styles/      # Estilos CSS
├── docs/                          # 📚 Documentación técnica
├── QUICK_START.txt                # Inicio rápido local
└── RAILWAY_FIX_CHECKLIST.md       # Guía de despliegue
```

## 🛠️ Tecnologías

### Backend

- **Node.js** + **Express**: Framework robusto y escalable
- **MongoDB** + **Mongoose**: Base de datos NoSQL con ODM
- **JWT**: Autenticación segura
- **bcrypt**: Hashing de contraseñas
- **express-validator**: Validaciones de entrada
- **express-rate-limit**: Protección contra abuso
- **Cloudinary**: Gestión de imágenes en la nube
- **csv-parser**: Lectura de archivos CSV

### Frontend

- **React 18**: Framework moderno con hooks
- **Vite**: Build tool rápido para desarrollo
- **React Router**: Navegación SPA
- **Axios**: Cliente HTTP para APIs
- **Tailwind CSS**: Framework CSS utility-first
- **Lucide React**: Iconos consistentes
- **React Context**: Gestión de estado global

## 🔐 Seguridad

- **Autenticación JWT**: Tokens seguros con expiración
- **Hashing bcrypt**: Contraseñas protegidas
- **Rate Limiting**: Protección contra ataques de fuerza bruta
- **Validaciones**: Entrada sanitizada en frontend y backend
- **Roles**: Control de acceso basado en permisos
- **CORS**: Configuración segura de orígenes permitidos

## 🚀 Despliegue

**Ambos en Railway** (Backend y Frontend)

1. ✅ Conectar repositorio a Railway
2. ✅ Configurar variables de entorno (ver [`RAILWAY_FIX_CHECKLIST.md`](RAILWAY_FIX_CHECKLIST.md))
3. ✅ Railway despliega automáticamente al hacer push a `main`

### Variables de Entorno Requeridas

Ver [`RAILWAY_FIX_CHECKLIST.md`](RAILWAY_FIX_CHECKLIST.md) para lista completa con instrucciones.

**Backend (Railway Variables):**
- `CORS_ORIGIN`: URL exacta del frontend
- `MONGODB_URI`: Connection string de MongoDB Atlas
- `JWT_SECRET`: Secret seguro para tokens
- `NODE_ENV`: `production`

**Frontend (Railway Variables):**
- `VITE_API_URL`: URL exacta del backend API

## 📚 Documentación

- [Documentación Completa](docs/README_COMPLETO.md) - Detalles técnicos, arquitectura, API
- [Backend](backend/README.md) - Configuración y uso del backend
- [Frontend](frontend/README.md) - Configuración y uso del frontend

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE) para más detalles.

---

_Desarrollado con ❤️ para la comunidad deportiva_
