# 🔴 ACCIÓN INMEDIATA - Tu despliegue está roto

## ¿Qué pasó?

Tu frontend en Vercel **no puede conectarse a tu backend en Railway** porque **falta una variable de entorno**.

### Síntomas:
- ❌ No se puede loguear
- ❌ No se puede registrar
- ❌ "Error de conexión" al intentar cualquier acción

---

## ✅ SOLUCIÓN (2 minutos)

### PASO 1: Abre Vercel Dashboard
```
https://vercel.com/dashboard
```

### PASO 2: Busca tu proyecto
Busca: `mara-frontend-production`

### PASO 3: Settings → Environment Variables

1. Click en **Settings** (arriba del proyecto)
2. En la barra izquierda: **Environment Variables**
3. Click en **Add New Environment Variable**

### PASO 4: Añade esta variable

```
Name:  VITE_API_URL
Value: https://mara-production-7e59.up.railway.app/api
```

Selecciona: ✅ Production, ✅ Preview, ✅ Development

Click: **Save**

### PASO 5: Espera a que Vercel redeploy

- Abre la pestaña **Deployments**
- Espera a que veas ✅ **Ready**
- Toma ~1-2 minutos

---

## ✅ TEST: ¿Funciona?

Después de que Vercel termina (cuando veas ✅ Ready):

1. Abre: https://mara-frontend-production.up.railway.app/login
2. Intenta loguear con:
   - Email: `admin@sportify.com`
   - Password: `Admin123!`

**Debería funcionar ahora** ✅

---

## 🤔 ¿Y si aún no funciona?

### Verifica que el backend está levantado:

En el navegador, abre:
```
https://mara-production-7e59.up.railway.app/api/health
```

Debería mostrar:
```json
{"ok":true}
```

Si ves error → El backend en Railway no está corriendo.

**Solución:** Ve a Railway → Tu proyecto → Click en "Deploy" o revisa los logs.

---

## 📚 Más Info

- `DEPLOYMENT_CONFIG/VERCEL_ENVIRONMENT_SETUP.md` - Guía completa de Vercel
- `DEPLOYMENT_CONFIG/RAILWAY_ENVIRONMENT_SETUP.md` - Guía completa de Railway
- `README.md` - Actualizado con URLs reales

---

**¿Completaste los pasos? Confirma cuando funcione el login. Después haremos la revisión UX/UI final.** ✅
