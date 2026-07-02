# 🚀 Configuración de Variables de Entorno - Railway (Backend)

**ESTADO:** ✅ Probablemente correcto, pero verifica

---

## 📋 Variables Requeridas en Railway

Tu backend necesita estas variables de entorno **configuradas correctamente** para que el frontend pueda conectarse:

### ✅ Variables Críticas

| Variable | Valor Requerido | Notas |
|----------|----------|-------|
| `CORS_ORIGIN` | `https://mara-frontend-production.up.railway.app` | URL del frontend en Railway |
| `NODE_ENV` | `production` | Asegura que está en modo producción |
| `PORT` | `4000` | Puerto por defecto |
| `MONGODB_URI` | `mongodb://...` | Conexión a MongoDB |
| `JWT_SECRET` | `tu_jwt_secret_seguro` | Token secret (debe ser único) |
| `CLOUDINARY_CLOUD_NAME` | Tu cloud name | Para subir imágenes |
| `CLOUDINARY_API_KEY` | Tu API key | Para subir imágenes |
| `CLOUDINARY_API_SECRET` | Tu API secret | Para subir imágenes |

---

## 🔍 Cómo Verificar en Railway

### Paso 1: Abre tu proyecto en Railway

1. Ve a [railway.app](https://railway.app)
2. Busca tu proyecto `mara-production`
3. Click en el proyecto

### Paso 2: Accede a las variables

1. En el dashboard, busca la opción **Variables** o **Environment**
2. Click en ella

### Paso 3: Verifica `CORS_ORIGIN`

Busca la variable `CORS_ORIGIN`:

- Si existe y dice: `https://mara-frontend-production.up.railway.app` ✅
- Si no existe → añádela
- Si dice otra cosa → cámbiala

### Paso 4: Si necesitas cambiar

Para **añadir o modificar** una variable:

1. Click en **+ New Variable** (si existe ese botón)
2. O click en la variable existente para editarla
3. Asegúrate de que sea exactamente:
   ```
   CORS_ORIGIN = https://mara-frontend-production.up.railway.app
   ```
4. Click en Save o Deploy

---

## ⚙️ Variables Adicionales (Verificar)

Estas también deberían estar presentes:

### MONGODB_URI
```
mongodb://[usuario]:[password]@[host]:[puerto]/[database]
```

**Si no tienes MongoDB en Railway:**
- Opción 1: Usa MongoDB Atlas (nube, gratis)
- Opción 2: Añade MongoDB a tu proyecto en Railway

### JWT_SECRET
Cualquier string largo y complejo:
```
tu_jwt_secret_super_largo_y_complicado_1234567890!@#$%
```

### CLOUDINARY
Obtenlas de [cloudinary.com](https://cloudinary.com):
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

---

## 🔄 Después de Cambiar Variables

**Railway redeplegará automáticamente** después de que guardes.

Espera a que veas:
- ✅ Deployment successful
- ✅ Service running

---

## ✅ Test: Verificar que Backend Funciona

### En cualquier navegador:

```
https://mara-production-7e59.up.railway.app/api/health
```

Debería mostrar:
```json
{"ok":true}
```

Si ves error → El backend no está corriendo.

---

## 🐛 Troubleshooting

### Error: "CORS_ORIGIN must be a string"

El formato es incorrecto. Debe ser exactamente:
```
CORS_ORIGIN = https://mara-frontend-production.up.railway.app
```

No con comillas ni caracteres especiales.

### Error: "MongoDB connection failed"

MongoDB no está disponible. Opción 1:
1. Ve a [mongodb.com/cloud](https://www.mongodb.com/cloud)
2. Crea una BD gratuita (M0)
3. Copia la connection string
4. Pega en `MONGODB_URI`

### Error: "jwt malformed"

`JWT_SECRET` no está configurado. Añade cualquier string largo.

---

## 📋 Checklist Final

- [ ] `CORS_ORIGIN` = `https://mara-frontend-production.up.railway.app`
- [ ] `NODE_ENV` = `production`
- [ ] `MONGODB_URI` configurado
- [ ] `JWT_SECRET` configurado
- [ ] `CLOUDINARY_*` variables presentes (si usas imágenes)
- [ ] Backend responde en `/api/health` con `{"ok":true}`
- [ ] Frontend (Vercel) tiene `VITE_API_URL` configurado

Una vez que todo esté correcto:

✅ **Login debería funcionar**

---

**¿Necesitas ayuda? Revisa cada variable una por una.**
