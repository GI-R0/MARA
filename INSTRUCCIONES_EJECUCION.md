# 🚀 Instrucciones para Ejecutar SportifyClub

## ✅ Estado del Proyecto

- **Backend**: Node.js + Express + MongoDB ✓
- **Frontend**: React 19 + Vite ✓
- **Dependencias**: Instaladas y actualizadas ✓
- **Archivos .env**: Configurados ✓

---

## 📋 Requisitos Previos

1. **Node.js v18+** - [Descargar](https://nodejs.org/)
2. **MongoDB Local** - [Descargar](https://www.mongodb.com/try/download/community)
   - O usar MongoDB Atlas (online)
3. **Git** (opcional)

---

## 🎯 Opción 1: Ejecución LOCAL (Recomendado)

### Paso 1: Inicia MongoDB

```powershell
# En Windows, si MongoDB está instalado:
mongod

# O si usas MongoDB como servicio (Windows):
net start MongoDB
```

### Paso 2: Inicia el Backend

```powershell
cd c:\Users\usuario\OneDrive\Escritorio\sportify\sportifyclub\backend
npm run dev
```

✅ Backend corriendo en: **http://localhost:4000**

### Paso 3: Inicia el Frontend (en otra terminal)

```powershell
cd c:\Users\usuario\OneDrive\Escritorio\sportify\sportifyclub\frontend\sportifyclub-frontend
npm run dev
```

✅ Frontend corriendo en: **http://localhost:5173**

### Accede a la aplicación

Abre en el navegador: **http://localhost:5173**

---

## 🎯 Opción 2: Build para Producción

### Frontend Build

```powershell
cd c:\Users\usuario\OneDrive\Escritorio\sportify\sportifyclub\frontend\sportifyclub-frontend
npm run build
```

Genera archivos en: `dist/`

### Backend Start (Producción)

```powershell
cd c:\Users\usuario\OneDrive\Escritorio\sportify\sportifyclub\backend
npm start
```

---

## 🔐 Configuración de Variables de Entorno

### Backend (.env)

```
MONGODB_URI=mongodb://localhost:27017/sportify
JWT_SECRET=supersecretkey123!@#2025
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)

```
VITE_API_URL=http://localhost:4000/api
```

---

## 📊 Seeding de Base de Datos (Datos de Prueba)

```powershell
cd c:\Users\usuario\OneDrive\Escritorio\sportify\sportifyclub\backend
npm run seed
```

**Esto cargará:**

- ✓ Usuarios demo
- ✓ Pistas de deportes
- ✓ Reservas de ejemplo

---

## 🧪 Scripts Disponibles

### Backend

```powershell
npm run dev          # Inicio con nodemon (desarrollo)
npm start            # Inicio directo (producción)
npm run seed         # Cargar datos de prueba
npm run test-mongo   # Verificar conexión MongoDB
```

### Frontend

```powershell
npm run dev          # Inicio servidor desarrollo
npm run build        # Compilar para producción
npm run lint         # Revisar código con ESLint
npm run preview      # Vista previa del build
```

---

## 🐛 Solución de Problemas

### ❌ Error: "Cannot find module 'express'"

```powershell
npm install
```

### ❌ Error: "MongoDB connection failed"

- Verifica que MongoDB esté ejecutándose
- Comprueba la URI en `.env`
- Alternativa: Usa MongoDB Atlas (online)

### ❌ Puerto 4000 ya está en uso

```powershell
netstat -ano | findstr :4000
taskkill /PID <PID> /F
```

### ❌ CORS errors

- Verifica que `FRONTEND_URL` sea correcto en backend .env
- Verifica que `VITE_API_URL` sea correcto en frontend .env

### ❌ Node modules corrupto

```powershell
rm -r node_modules package-lock.json
npm install
```

---

## 📁 Estructura del Proyecto

```
sportifyclub/
├── backend/                 # API Express
│   ├── src/
│   │   ├── app.js          # Aplicación principal
│   │   ├── config/         # Configuración (BD, Cloudinary)
│   │   ├── controllers/    # Lógica de negocio
│   │   ├── models/         # Esquemas Mongoose
│   │   ├── routes/         # Rutas API
│   │   ├── middlewares/    # Auth, Rate Limit
│   │   ├── validators/     # Validación de datos
│   │   └── seed/           # Datos de prueba
│   ├── package.json
│   └── .env
│
└── frontend/
    └── sportifyclub-frontend/  # Aplicación React
        ├── src/
        │   ├── pages/          # Páginas principales
        │   ├── components/     # Componentes reutilizables
        │   ├── context/        # Context API (Auth, Reservas)
        │   ├── hooks/          # Custom hooks
        │   ├── styles/         # CSS styling
        │   ├── api/            # Configuración Axios
        │   └── App.jsx
        ├── package.json
        ├── .env
        └── vite.config.js
```

---

## ✨ Características Principales

- ✅ Autenticación JWT
- ✅ Gestión de pistas de deportes
- ✅ Sistema de reservas
- ✅ Panel de administrador
- ✅ Panel de club
- ✅ Validación en cliente y servidor
- ✅ Rate limiting
- ✅ Subida de imágenes (Cloudinary)

---

## 👤 Cuentas de Prueba

Después de ejecutar `npm run seed`:

| Email          | Contraseña | Rol   |
| -------------- | ---------- | ----- |
| admin@sportify.com | admin123 | admin |
| ana@sportify.com   | 12345678 | club  |
| luis@sportify.com  | 12345678 | user  |

---

## 📞 Soporte

Si encuentras problemas:

1. Revisa la consola para mensajes de error
2. Verifica que MongoDB esté corriendo
3. Comprueba las variables de entorno
4. Consulta la documentación completamente

---

**¡Listo para ejecutar! 🎯**
