# Backend - SportifyClub API

## Descripción

API REST desarrollada con Node.js y Express para la gestión de reservas de pistas deportivas.

## Tecnologías

- Node.js
- Express.js
- MongoDB con Mongoose
- JWT para autenticación
- Cloudinary para gestión de imágenes
- Express Rate Limit para seguridad

## Instalación

```bash
cd backend
npm install
```

## Configuración

Crear archivo `.env` basado en `.env.example`:

```env
# Base de datos MongoDB
MONGODB_URI=mongodb://localhost:27017/sportify

# Autenticación JWT
JWT_SECRET=tu_jwt_secreto_muy_seguro_minimo_32_caracteres

# Cloudinary (para almacenamiento de imágenes)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Servidor
PORT=4000
HOST=0.0.0.0
NODE_ENV=development

# CORS - URL del frontend (importante para desarrollo/producción)
FRONTEND_URL=http://localhost:5173  # Vite dev
# FRONTEND_URL=http://localhost:3000  # Alternativa
# FRONTEND_URL=https://tu-dominio-produccion.com  # Producción
```

### Variables de Entorno Importantes:

- `MONGODB_URI`: URL de conexión a MongoDB (local o Atlas)
- `JWT_SECRET`: Clave secreta para firmar tokens JWT (mínimo 32 caracteres en producción)
- `FRONTEND_URL`: URL del frontend para configurar CORS correctamente
- `NODE_ENV`: `development` o `production`

## Uso

### Desarrollo

```bash
npm run dev  # Con nodemon
```

### Producción

```bash
npm start
```

## Estructura

- `src/app.js`: Configuración principal de Express
- `src/models/`: Esquemas de MongoDB
- `src/routes/`: Endpoints API
- `src/controllers/`: Lógica de negocio
- `src/middlewares/`: Middlewares de autenticación y seguridad
- `src/validators/`: Validaciones de entrada

## API Endpoints

### Autenticación

- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Perfil de usuario

### Pistas

- `GET /api/pistas` - Listar pistas
- `POST /api/pistas` - Crear pista (clubs/admins)
- `PUT /api/pistas/:id` - Actualizar pista
- `DELETE /api/pistas/:id` - Eliminar pista

### Reservas

- `GET /api/reservas` - Listar reservas del usuario
- `POST /api/reservas` - Crear reserva
- `PUT /api/reservas/:id` - Actualizar reserva
- `DELETE /api/reservas/:id` - Cancelar reserva

## Modelos de Datos

Ver [MODELOS_BASE_DATOS.md](MODELOS_BASE_DATOS.md)

## Relaciones

Ver [DIAGRAMA_RELACIONES.md](DIAGRAMA_RELACIONES.md)

## Seed

## Seguridad

- Autenticación JWT
- Rate limiting
- Validaciones de entrada
- Hashing de contraseñas con bcrypt
