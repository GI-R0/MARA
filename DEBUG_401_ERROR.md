# 🔴 DEBUG: ERROR 401 EN /auth/me

## 📍 PROBLEMA
```
mara-production-7e59.up.railway.app/api/auth/me:1  
Failed to load resource: the server responded with a status of 401 ()
```

El backend rechaza la solicitud con status 401 (No autorizado).

---

## 🔍 DIAGNÓSTICO PASO A PASO

### PASO 1: ¿El backend responde?
```
GET https://mara-production-7e59.up.railway.app/api/health
```
**Esperado:** `{"ok":true}`

Si esto falla → **Backend no está corriendo**

---

### PASO 2: ¿Está configurado MongoDB?
```
1. Ve a Railway → mara-production-7e59
2. Ve a "Logs"
3. Busca este mensaje en los primeros logs:

   ✅ "✅ Conectado a MongoDB"
   ❌ "Error conectando a MongoDB"
   ❌ "Cannot connect to..."
```

**Si ves ❌:** MongoDB_URI está mal configurado o inválido

---

### PASO 3: ¿Están configuradas las variables JWT?
```
En Railway → Backend Variables, verifica:

[ ] JWT_SECRET = existe y no está vacío
[ ] JWT_REFRESH_SECRET = existe y no está vacío
[ ] NODE_ENV = production
[ ] CORS_ORIGIN = https://mara-frontend-production.up.railway.app
```

**Si falta algo:** No se pueden generar tokens

---

### PASO 4: ¿Se genera el token en login?

**En el navegador:**
```
1. Abre https://mara-frontend-production.up.railway.app
2. Presiona F12 (DevTools)
3. Ve a "Storage" → "Local Storage"
4. Busca la clave "token"

¿Existe "token"?
- ✅ SÍ → Token se guardó, pero podría estar vacío
- ❌ NO → Token NO se generó en login
```

**Si NO existe:**
```
5. Ve a "Network"
6. Intenta hacer login
7. Busca request POST a /auth/login
8. Haz clic en él
9. Ve a "Response"
10. ¿Devuelve un "token"?
```

---

### PASO 5: ¿El token se envía en /auth/me?

```
1. Ve a "Network"
2. Intenta cargar cualquier página protegida
3. Busca request GET a /auth/me
4. Haz clic en él
5. Ve a "Request Headers"
6. ¿Existe "Authorization: Bearer ..."?

- ✅ SÍ → Token se envía correctamente
- ❌ NO → axiosConfig no agrega el header
```

---

## 🛠️ PROBLEMAS COMUNES Y SOLUCIONES

### Error 1: JWT_SECRET no está configurado
```
Síntomas:
- Login intenta funcionar pero falla
- /auth/me devuelve 401
- En logs: "JWT error" o "jwt is not defined"

Solución:
1. Ve a Railway → Backend Variables
2. Crea variable JWT_SECRET
3. Pon un valor seguro (ej: mi_jwt_super_secret_2026_12345678)
4. Guarda y espera redeploy (2-3 min)
5. Intenta login de nuevo
```

### Error 2: MONGODB_URI es inválido
```
Síntomas:
- Logs dicen "Cannot connect to MongoDB"
- Login falla
- Usuario NO se crea en DB

Solución:
1. Abre MongoDB Atlas: https://cloud.mongodb.com
2. Ve a tu cluster
3. Haz clic en "Connect"
4. Selecciona "Drivers"
5. Elige "Node.js"
6. Copia el connection string
7. En Railway Backend Variables:
   - MONGODB_URI = [pegar el string]
8. Reemplaza <password> con tu contraseña real
9. Guarda y espera redeploy
```

### Error 3: CORS_ORIGIN está mal
```
Síntomas:
- Frontend hace request pero backend rechaza
- Error: "CORS policy: No 'Access-Control-Allow-Origin' header"

Solución:
1. En Railway Backend Variables
2. Verifica CORS_ORIGIN sea EXACTAMENTE:
   https://mara-frontend-production.up.railway.app
3. Sin http:// (DEBE ser HTTPS)
4. Sin rutas extra
5. Sin "/" al final
```

### Error 4: axiosConfig no está leyendo VITE_API_URL
```
Síntomas:
- Frontend hace requests a localhost en lugar de Railway
- 404 errors en network

Solución:
1. Frontend/.env.example o .env debe tener:
   VITE_API_URL=https://mara-production-7e59.up.railway.app/api
2. En Railway Frontend Variables:
   VITE_API_URL = https://mara-production-7e59.up.railway.app/api
3. Redeploy
```

---

## 🔧 PASOS RÁPIDOS DE FIX

### Si todo está roto:

**PASO 1: Revisar Variables Backend (5 min)**
```
En Railway Backend:
[ ] NODE_ENV = production
[ ] MONGODB_URI = mongodb+srv://user:pass@cluster...
[ ] JWT_SECRET = algo_seguro_largo
[ ] JWT_REFRESH_SECRET = algo_seguro_largo
[ ] CORS_ORIGIN = https://mara-frontend-production.up.railway.app
```

**PASO 2: Revisar Variables Frontend (2 min)**
```
En Railway Frontend:
[ ] VITE_API_URL = https://mara-production-7e59.up.railway.app/api
```

**PASO 3: Redeploy (3 min)**
```
En ambos proyectos (Backend y Frontend):
- Haz clic en "Deployments"
- Busca el último deploy
- Haz clic en los 3 puntos (...)
- Selecciona "Redeploy"
- Espera a que termine
```

**PASO 4: Test (2 min)**
```
1. Health: https://mara-production-7e59.up.railway.app/api/health
   ¿Devuelve {"ok":true}?
2. Login: Intenta loguear
   ¿Funciona?
3. Reservas: ¿Puedes ver mis reservas?
```

---

## 📊 RESUMEN DE VERIFICACIÓN

Copia esto y marca lo que verificaste:

```
BACKEND VERIFICACIÓN:
[ ] /api/health devuelve {"ok":true}
[ ] Logs dicen "✅ Conectado a MongoDB"
[ ] NODE_ENV = production
[ ] MONGODB_URI no está vacío
[ ] JWT_SECRET existe
[ ] CORS_ORIGIN es correcto

FRONTEND VERIFICACIÓN:
[ ] Página carga sin errores
[ ] VITE_API_URL existe
[ ] Token se guarda en localStorage después de login
[ ] Authorization header se envía en requests

LOGIN VERIFICACIÓN:
[ ] Email y password correctos
[ ] POST /auth/login devuelve token
[ ] Token se guarda en localStorage
[ ] GET /auth/me devuelve datos del usuario
```

---

## 🎯 ACCIÓN INMEDIATA

**Si acabas de hacer push a GitHub:**
1. Revisa las variables en Railway (Backend y Frontend)
2. Si faltan → Agrégalas
3. Si están mal → Corrígelas
4. Fuerza redeploy manual
5. Espera 3-5 minutos
6. Prueba login de nuevo

**Si sigue fallando:**
1. Copia los logs exactos de Railway
2. Copia el error de F12 Console
3. Describe los pasos que hiciste
4. Comparte toda esta información

---

## 📞 INFORMACIÓN PARA DEBUG

Cuando reportes, incluye:

```
1. Error exacto que ves:
   

2. ¿Dónde lo ves? (URL, componente):
   

3. Steps para reproducir:
   

4. Logs del backend (últimas 20 líneas):
   

5. Errores en F12 Console:
   

6. Variables en Railway (Backend y Frontend):
   

7. ¿Funciona en local? (npm run dev):
   SÍ / NO
```

---

**¡Sigue estos pasos y el 401 desaparecerá!** 🚀
