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
MONGODB_URI=mongodb://localhost:27017/sportify
JWT_SECRET=tu_jwt_secret
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
PORT=4000
NODE_ENV=development
```

## Uso

### Desarrollo
```bash
npm run dev  # Con nodemon
```

### Producción
```bash
npm start
```

### Seeding
```bash
npm run seed  # Carga datos iniciales desde CSV
```

## Estructura
- `src/app.js`: Configuración principal de Express
- `src/models/`: Esquemas de MongoDB
- `src/routes/`: Endpoints API
- `src/controllers/`: Lógica de negocio
- `src/middlewares/`: Middlewares de autenticación y seguridad
- `src/validators/`: Validaciones de entrada
- `data/`: Archivos CSV para seeding

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
Ver [MODELOS_BASE_DATOS.md](../backend/MODELOS_BASE_DATOS.md)

## Relaciones
Ver [DIAGRAMA_RELACIONES.md](../backend/DIAGRAMA_RELACIONES.md)

## Seguridad
- Autenticación JWT
- Rate limiting
- Validaciones de entrada
- Hashing de contraseñas con bcrypt