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

## 📈 Sentido del Proyecto

SportifyClub resuelve un problema real en el mundo del deporte: la dificultad para encontrar y reservar instalaciones deportivas de manera eficiente. En muchas ciudades, los clubes deportivos tienen pistas subutilizadas mientras que los jugadores pierden tiempo buscando dónde jugar.

### 🎯 Público Objetivo

- **Jugadores individuales**: Personas que quieren practicar deportes sin necesidad de ser miembros de un club
- **Equipos amateurs**: Grupos que necesitan pistas para entrenamientos o partidos
- **Clubes deportivos**: Entidades que quieren digitalizar y optimizar la gestión de sus instalaciones
- **Administradores**: Supervisores que necesitan controlar el sistema completo

### 💡 Valor Propuesto

1. **Para Jugadores**: Fácil acceso a pistas disponibles, reserva instantánea, comparación de precios
2. **Para Clubes**: Mayor ocupación de pistas, reducción de llamadas telefónicas, gestión digital
3. **Para el Sistema Deportivo**: Democratización del acceso al deporte, promoción de la actividad física

### 🎨 UX/UI Philosophy

- **Minimalista y Deportivo**: Diseño limpio inspirado en apps deportivas como Strava
- **Mobile-First**: Optimizado para reservas rápidas desde móvil
- **Colores Temáticos**: Azul Barça para confianza, rojo para energía, dorado para premium
- **Navegación Intuitiva**: Flujo de reserva en 3 pasos máximo
- **Accesibilidad**: Contraste alto, fuentes legibles, navegación por teclado

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
│   ├── src/
│   │   ├── controllers/  # Lógica de negocio
│   │   ├── models/       # Modelos MongoDB
│   │   ├── routes/       # Definición de rutas
│   │   ├── middlewares/  # Middlewares personalizados
│   │   ├── validators/   # Validaciones de entrada
│   │   └── tools/        # Scripts y Seeders (generateData.js, seed.js)
│   └── data/             # Archivos CSV de datos
├── frontend/         # 🌐 Interfaz React
│   └── sportifyclub-frontend/
│       ├── src/
│       │   ├── components/  # Componentes reutilizables
│       │   ├── pages/       # Páginas principales
│       │   ├── hooks/       # Hooks personalizados
│       │   ├── context/     # Contextos React
│       │   ├── api/         # Configuración Axios
│       │   └── styles/      # Estilos CSS
│       └── public/          # Assets estáticos
├── docs/             # 📚 Documentación completa
├── QUICK_START.txt   # Inicio rápido
└── CHECKLIST_ENTREGA.txt  # Checklist de entrega
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

### Arquitectura

- **MVC Pattern**: Separación clara de responsabilidades
- **RESTful API**: Diseño de API estándar
- **Componentización**: Reutilización máxima de componentes
- **Custom Hooks**: Lógica reutilizable (useAuth, useFetch, useDebounce)
- **Context API**: Estado global sin librerías externas
- **Responsive Design**: Mobile-first approach

## 📊 Base de Datos

### Generación de Datos

Los datos se generan automáticamente usando Faker.js y se exportan a CSV:

```bash
cd backend
node src/tools/generateData.js
```

Esto crea 150+ registros distribuidos en 3 colecciones relacionadas:

- **Usuarios** (50): Jugadores, clubs y admins
- **Pistas** (50): Instalaciones deportivas con características
- **Reservas** (50): Reservas que conectan usuarios con pistas

### Relaciones

```
Usuario (Club) ────┐
                   ├── Pista
Usuario (Jugador) ─┘
                   │
                   └── Reserva
```

## 🔐 Seguridad

- **Autenticación JWT**: Tokens seguros con expiración
- **Hashing bcrypt**: Contraseñas protegidas
- **Rate Limiting**: Protección contra ataques de fuerza bruta
- **Validaciones**: Entrada sanitizada en frontend y backend
- **Roles**: Control de acceso basado en permisos
- **CORS**: Configuración segura de orígenes permitidos

## 🚀 Despliegue

### Backend (Railway)

1. Conectar repositorio a Railway
2. Configurar variables de entorno
3. Desplegar automáticamente

### Frontend (Vercel)

1. Conectar repositorio a Vercel
2. Configurar build settings
3. Desplegar automáticamente

### Variables de Entorno Requeridas

```env
# Backend
MONGODB_URI=mongodb://...
JWT_SECRET=tu_jwt_secret_seguro
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
PORT=4000

# Frontend
VITE_API_URL=https://tu-backend-deployed.com
```

## 📚 Documentación

- [Documentación Completa](docs/README_COMPLETO.md) - Detalles técnicos, arquitectura, API
- [Backend](backend/README.md) - Configuración y uso del backend
- [Frontend](frontend/README.md) - Configuración y uso del frontend

## 🤝 Contribución

1. Fork el proyecto
2. Crea tu rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📧 Contacto

Para soporte o preguntas: [Tu email]

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE) para más detalles.

---

_Desarrollado con ❤️ para la comunidad deportiva_
