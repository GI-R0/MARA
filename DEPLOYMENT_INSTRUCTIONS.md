# 🚀 INSTRUCCIONES DE DESPLIEGUE EN RAILWAY

## ⚠️ CRÍTICO - LEE PRIMERO

Para que el proyecto funcione en Railway, **DEBES configurar las variables de entorno correctamente**. Sin esto, nada funcionará.

---

## 1️⃣ BACKEND (mara-production-7e59)

Abre Railway → Proyecto Backend → **Variables** → Agrega/Verifica estas variables:

```
NODE_ENV = production
CORS_ORIGIN = https://mara-frontend-production.up.railway.app
MONGODB_URI = [tu connection string de MongoDB Atlas sin comillas]
JWT_SECRET = [algo seguro y largo, ej: Super$Secure@Token123!ABC]
JWT_REFRESH_SECRET = [otro secret seguro, ej: RefreshToken$ABC123!XYZ]
PORT = [Railway lo asigna automáticamente, déjalo vacío o deja el default]
```

**DESPUÉS de agregar las variables:**
- Railway debe redeploying automáticamente
- Espera 3-5 minutos
- Verifica que el status sea ✅ "success"

---

## 2️⃣ FRONTEND (mara-frontend-production)

Abre Railway → Proyecto Frontend → **Variables** → Agrega/Verifica:

```
VITE_API_URL = https://mara-production-7e59.up.railway.app/api
```

**DESPUÉS de agregar la variable:**
- Railway debe redeploying automáticamente
- Espera 3-5 minutos
- Verifica que el status sea ✅ "success"

---

## 🔍 VALIDACIÓN RÁPIDA

### Test 1: ¿El backend responde?
Abre en el navegador:
```
https://mara-production-7e59.up.railway.app/api/health
```

Debería devolver:
```json
{"ok":true}
```

### Test 2: ¿El frontend carga?
Abre:
```
https://mara-frontend-production.up.railway.app
```

Debería cargar la página SIN errores, sin estar en blanco.

### Test 3: ¿Login funciona?
Email: `admin@sportify.com`
Password: `Admin123!`

Debería poder loguear sin problemas.

---

## ❌ SI ALGO FALLA

### Problema: Frontend en blanco
**Solución:**
1. Abre F12 → Console
2. ¿Ves errores rojos? Cópialos
3. Ve a Railway → Deployments → Logs del último deploy
4. Busca errores en los logs

### Problema: Backend devuelve error
**Solución:**
1. Ve a Railway Backend → Deployments → Logs
2. Busca errores en los logs
3. Verifica que MONGODB_URI esté correcta (sin espacios, sin comillas)
4. Verifica que JWT_SECRET no esté vacío

### Problema: No puedo loguear
**Solución:**
1. Verifica que VITE_API_URL esté correcto en Frontend Variables
2. Verifica que CORS_ORIGIN esté correcto en Backend Variables
3. Recarga con Ctrl+Shift+R (hard refresh)
4. Abre F12 → Network → intenta loguear
5. Busca el request a `/api/auth/login` - ¿cuál es el status? (200, 401, 404, 500?)

---

## 📚 MONGODB ATLAS - OBTENER CONNECTION STRING

1. Abre https://cloud.mongodb.com
2. Ve a tu cluster
3. Haz clic en **"Connect"**
4. Selecciona **"Drivers"**
5. Copia la connection string (debería ser algo como `mongodb+srv://usuario:contraseña@cluster.mongodb.net/database?retryWrites=true&w=majority`)
6. **REEMPLAZA** `<password>` con tu contraseña real
7. **REEMPLAZA** `<database>` con `sportifyclub` (o tu nombre de BD)
8. Pega en Railway Backend Variables como `MONGODB_URI`

---

## ✅ CHECKLIST FINAL

Antes de hacer testing final:

- [ ] Backend Variables tienen NODE_ENV, CORS_ORIGIN, MONGODB_URI, JWT_SECRET, JWT_REFRESH_SECRET
- [ ] Frontend Variables tiene VITE_API_URL
- [ ] Ambos proyectos han hecho deploy (status = "success")
- [ ] Esperaste 3-5 minutos después de agregar variables
- [ ] `/api/health` devuelve `{"ok":true}`
- [ ] Frontend carga (no está en blanco)
- [ ] Puedes loguear con admin@sportify.com / Admin123!

---

## 🆘 SI NADA DE ESTO FUNCIONA

1. **Hard reset en Railway:**
   - Backend: Deployments → Último deploy → Redeploy
   - Frontend: Deployments → Último deploy → Redeploy
   - Espera 5-10 minutos

2. **Vacía caché del navegador:**
   - F12 → Settings → Storage → Clear All
   - O: Ctrl+Shift+Delete → Selecciona "All time" → Clear

3. **Contáctame con:**
   - Pantallazos de las variables en Railway
   - Los logs exactos del error
   - Lo que ves en F12 → Console del navegador

---

**¡El proyecto está LISTO para producción. Solo necesita las variables de entorno configuradas!**
