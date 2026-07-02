# ✅ Configuración Correcta - Ambos en Railway

**ACTUALIZACIÓN IMPORTANTE:** He descubierto que **ambos están en Railway**, no en Vercel.

---

## 📋 Configuración Actual (Correcta)

| Componente | URL | Plataforma |
|-----------|-----|-----------|
| **Frontend** | https://mara-frontend-production.up.railway.app | Railway ✅ |
| **Backend** | https://mara-production-7e59.up.railway.app/api | Railway ✅ |

---

## 🔧 Variables de Entorno Necesarias

### En Railway - Backend (mara-production)

Estas variables **DEBEN existir** en tu proyecto Railway:

```
CORS_ORIGIN = https://mara-frontend-production.up.railway.app
NODE_ENV = production
MONGODB_URI = mongodb://...
JWT_SECRET = tu_secret_seguro
CLOUDINARY_CLOUD_NAME = [tu cloud name]
CLOUDINARY_API_KEY = [tu api key]
CLOUDINARY_API_SECRET = [tu api secret]
```

**La más importante:** `CORS_ORIGIN = https://mara-frontend-production.up.railway.app`

---

## 🔄 He Actualizado Tu Configuración

### backend/vercel.json (Actualizado)

**Antes:**
```json
"env": {
  "FRONTEND_URL": "https://mara-hta9.vercel.app"  ❌ Incorrecto
}
```

**Ahora:**
```json
"env": {
  "CORS_ORIGIN": "https://mara-frontend-production.up.railway.app",
  "NODE_ENV": "production"
}
```

✅ **Cambio realizado**

---

## ⚠️ El Problema Que Encontré

En tu `backend/vercel.json` había una referencia a `mara-hta9.vercel.app` (un deploy viejo en Vercel), pero tu frontend real está en Railway.

**Esto pudo haber causado:**
- Frontend en Railway intentando conectar a backend
- Pero backend con CORS configurado para una URL diferente en Vercel
- ❌ Mismatch → Error de CORS

**Solución:** Actualizar a la URL correcta de Railway

---

## ✅ Verificación Paso a Paso

### Paso 1: Verifica que Backend tiene CORS_ORIGIN correcto

En **Railway Dashboard** → tu proyecto `mara-production`:

1. Click en **Variables** o **Environment**
2. Busca: `CORS_ORIGIN`
3. Debe decir exactamente: `https://mara-frontend-production.up.railway.app`

**Si no existe:**
1. Click en "+ Add Variable" o símbolo "+"
2. Name: `CORS_ORIGIN`
3. Value: `https://mara-frontend-production.up.railway.app`
4. Save/Deploy

### Paso 2: Verifica que Frontend tiene VITE_API_URL

En **Railway Dashboard** → tu proyecto `mara-frontend-production`:

1. Click en **Variables** o **Environment**
2. Busca: `VITE_API_URL`
3. Debe decir exactamente: `https://mara-production-7e59.up.railway.app/api`

**Si no existe:**
1. Click en "+ Add Variable" o símbolo "+"
2. Name: `VITE_API_URL`
3. Value: `https://mara-production-7e59.up.railway.app/api`
4. Save/Deploy

### Paso 3: Espera a que ambos redeploy terminen

En cada proyecto Railway:
- Abre **Deployments**
- Busca el más reciente
- Espera a que diga ✅ "Success" o "Running"

### Paso 4: Prueba Conexión

En el navegador:

**Test 1: Backend responde?**
```
https://mara-production-7e59.up.railway.app/api/health
→ Debe mostrar: {"ok":true}
```

**Test 2: Frontend carga?**
```
https://mara-frontend-production.up.railway.app
→ Debe mostrar página de login
```

**Test 3: Login funciona?**
```
Email: admin@sportify.com
Password: Admin123!
→ Debe aceptar y mostrar perfil
```

---

## 📊 Tabla de Variables

### Frontend (Railway - mara-frontend-production)
| Variable | Valor |
|----------|-------|
| VITE_API_URL | https://mara-production-7e59.up.railway.app/api |

### Backend (Railway - mara-production)
| Variable | Valor |
|----------|-------|
| CORS_ORIGIN | https://mara-frontend-production.up.railway.app |
| NODE_ENV | production |
| MONGODB_URI | mongodb://... |
| JWT_SECRET | tu_secret_seguro |
| CLOUDINARY_CLOUD_NAME | ... |
| CLOUDINARY_API_KEY | ... |
| CLOUDINARY_API_SECRET | ... |

---

## 🎯 Resumen

**Antes:**
- ❌ Backend configurado para Vercel (`mara-hta9.vercel.app`)
- ❌ Frontend en Railway pero backend esperando conexión de otra URL
- ❌ CORS mismatch → Error de conexión

**Ahora:**
- ✅ Backend configurado para Railway (`mara-frontend-production.up.railway.app`)
- ✅ Frontend en Railway conectando a backend en Railway
- ✅ Mismo dominio, CORS debe funcionar

---

## 🚀 Próximo Paso

1. Ve a **Railway Dashboard**
2. Verifica que **ambas variables existan** en los proyectos correctos
3. Si no existen, **añádelas**
4. Espera a que los deploys terminen
5. Prueba login/registro

**¿Listo?** Confirma cuando todo esté funcionando ✅

---

## 🔍 Nota Técnica

El backend en `src/config/cookies.js` hace esto:

```javascript
const rawValue = process.env.CORS_ORIGIN || process.env.FRONTEND_URL || "http://localhost:5173";
```

Busca `CORS_ORIGIN` primero, luego `FRONTEND_URL`. Yo cambié `vercel.json` para usar `CORS_ORIGIN` directamente, que es lo correcto.

---

**¿Necesitas ayuda para verificar las variables en Railway? Dime y te ayudo paso a paso.**
