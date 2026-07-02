# 🚀 CHECKLIST - FIX DEPLOYMENT EN RAILWAY

## 🎯 PROBLEMA ACTUAL
- Backend devuelve errores
- Frontend no puede hacer login/registro
- La comunicación entre frontend y backend está rota

## ✅ SOLUCIÓN: CONFIGURAR VARIABLES EN RAILWAY

### 1️⃣ BACKEND (mara-production-7e59 en Railway)

Accede a tu proyecto backend en Railway y ve a la sección **Variables**.

Asegúrate que están **EXACTAMENTE** así:

| Variable | Valor | Notas |
|----------|-------|-------|
| `NODE_ENV` | `production` | ✅ Debe estar en producción |
| `CORS_ORIGIN` | `https://mara-frontend-production.up.railway.app` | ✅ URL exacta del frontend |
| `MONGODB_URI` | `[tu connection string de MongoDB]` | ⚠️ Obtén de MongoDB Atlas |
| `JWT_SECRET` | `[tu secret seguro]` | ✅ Usa algo seguro y largo |
| `JWT_REFRESH_SECRET` | `[igual que JWT_SECRET o diferente]` | ✅ Para refresh tokens |
| `PORT` | `4000` | ✅ Railway lo asignará automáticamente |
| `CLOUDINARY_CLOUD_NAME` | `[tu cloud name]` | Si usas Cloudinary |
| `CLOUDINARY_API_KEY` | `[tu key]` | Si usas Cloudinary |
| `CLOUDINARY_API_SECRET` | `[tu secret]` | Si usas Cloudinary |
| `FRONTEND_URL` | `https://mara-frontend-production.up.railway.app` | ✅ Alternativa a CORS_ORIGIN |
| `MAILER_EMAIL` | `[tu email para notificaciones]` | ✅ Para enviar correos |
| `MAILER_PASSWORD` | `[tu contraseña/token]` | ✅ Token de Gmail u otro |

✨ **ACCIÓN**: Después de configurar, Railway **debe hacer un nuevo deploy automáticamente**.

---

### 2️⃣ FRONTEND (mara-frontend-production en Railway)

Accede a tu proyecto frontend en Railway y ve a la sección **Variables**.

Asegúrate que está:

| Variable | Valor | Notas |
|----------|-------|-------|
| `VITE_API_URL` | `https://mara-production-7e59.up.railway.app/api` | ✅ URL EXACTA del backend |

✨ **ACCIÓN**: Después de configurar, Railway **debe hacer un nuevo deploy automáticamente**.

---

## 🔍 VALIDACIÓN RÁPIDA

Después de configurar, prueba:

### Test 1: ¿El backend responde?
```
GET https://mara-production-7e59.up.railway.app/api/health
```
Debería devolver: `{"ok":true}`

### Test 2: ¿El frontend carga?
```
Abre https://mara-frontend-production.up.railway.app en tu navegador
```
Debería cargar sin errores

### Test 3: ¿Login funciona?
```
Email: admin@sportify.com
Password: Admin123!
```
Debería poder loguear sin errores

---

## 🐛 SI SIGUE SIN FUNCIONAR

### Paso 1: Revisar logs
1. En Railway, ve a **Deployments**
2. Haz clic en el último deploy del backend
3. Mira los logs en la sección **Logs**
4. Busca errores sobre MongoDB, CORS, o JWT

### Paso 2: Validar MongoDB
- Abre [MongoDB Atlas](https://cloud.mongodb.com)
- Verifica que tu cluster está activo
- Copia el connection string exacto (sin `<password>`)
- En Railway Backend Variables, pega el `MONGODB_URI` correcto

### Paso 3: Revisar CORS
- El backend debe permitir el origen exacto del frontend
- En Railway Backend Variables, verifica `CORS_ORIGIN`

### Paso 4: Clear browser cache
- Abre DevTools (F12)
- Haz clic derecho en la pestaña de reload
- Selecciona "Empty cache and hard refresh"

---

## ✨ RESUMEN RÁPIDO

1. ✅ Abre Railway → Backend Project
2. ✅ Variables → Asegúrate `CORS_ORIGIN` = frontend URL exacta
3. ✅ Variables → Asegúrate `MONGODB_URI` está configurado
4. ✅ Abre Railway → Frontend Project  
5. ✅ Variables → Asegúrate `VITE_API_URL` = backend API URL exacta
6. ✅ Espera a que Railway haga redeploy automático (2-3 minutos)
7. ✅ Prueba login en https://mara-frontend-production.up.railway.app

---

## 📞 SOPORTE

Si aún no funciona después de esto:
1. Copia los logs exactos del Railway
2. Describe qué error ves en el navegador (F12 → Console)
3. Comparte pantallazos de las variables en Railway

**Commit empujado**: `2d1ec93` - Contiene todas las correcciones de CORS y UX
