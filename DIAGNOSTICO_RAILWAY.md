# 🔍 DIAGNÓSTICO DE RAILWAY - GUÍA PASO A PASO

## 📋 QUÉ REVISAR

Sigue esta guía para diagnosticar qué está fallando en Railway.

---

## 🚀 PASO 1: Verificar Backend

### 1.1 Abre Railway Dashboard
```
1. Ve a https://railway.app
2. Inicia sesión
3. Busca el proyecto "mara-production-7e59" (Backend)
4. Haz clic en él
```

### 1.2 Revisa el estado del deployment
```
- Busca el botón "Deployments" en el menú lateral
- Verifica si el último deploy tiene status ✅ (verde) o ❌ (rojo)
```

### 1.3 Si es ❌ ROJO = Deployment FALLÓ
```
- Haz clic en el deployment fallido
- Ve a la sección "Logs"
- Lee los mensajes de error
- Copia el error exacto
```

### 1.4 Si es ✅ VERDE = Deployment EXITOSO
```
- Pero podría haber error en runtime
- Ve a "Logs"
- Busca mensajes rojos o "ERROR"
- Copia cualquier error que encuentres
```

---

## 📊 PASO 2: Verificar Variables de Entorno

### 2.1 Backend Variables
```
1. En el proyecto backend, busca "Variables"
2. Verifica que TODAS estas existan:

   ✅ NODE_ENV = production
   ✅ CORS_ORIGIN = https://mara-frontend-production.up.railway.app
   ✅ MONGODB_URI = (algo como mongodb+srv://...)
   ✅ JWT_SECRET = (algo seguro)
   ✅ JWT_REFRESH_SECRET = (algo seguro)
```

### 2.2 Frontend Variables
```
1. En el proyecto frontend, busca "Variables"
2. Verifica que EXISTA:

   ✅ VITE_API_URL = https://mara-production-7e59.up.railway.app/api
```

---

## 🧪 PASO 3: Test de Conectividad

### Test 1: ¿El backend responde?
```bash
# Abre tu navegador y ve a:
https://mara-production-7e59.up.railway.app/api/health

# Deberías ver: {"ok":true}
```

**Si NO responde:**
- Backend no está corriendo
- Revisa logs de deployment

**Si responde error 500:**
- Backend está corriendo pero con error
- Revisa logs para ver qué falla

### Test 2: ¿El frontend carga?
```
Abre: https://mara-frontend-production.up.railway.app
Presiona F12 para abrir DevTools
Ve a la pestaña "Console"
¿Hay errores en rojo?
```

**Si ves errores:**
- Copia el error exacto
- Probablemente VITE_API_URL está mal configurado

### Test 3: ¿Puedes loguear?
```
1. Abre la app
2. Intenta loguear con:
   Email: admin@sportify.com
   Password: Admin123!

3. ¿Qué pasa?
   - ✅ Login exitoso = FUNCIONA
   - ❌ Error de conexión = Backend no conecta
   - ❌ Error 401/403 = JWT problem
```

---

## 🐛 ERRORES COMUNES Y SOLUCIONES

### Error 1: "Cannot connect to MongoDB"
```
Problema: MONGODB_URI falta o es inválido

Solución:
1. Abre MongoDB Atlas: https://cloud.mongodb.com
2. Tu cluster DEBE estar en estado "RUNNING"
3. Copia el connection string:
   - Click "Connect"
   - Click "Drivers"
   - Selecciona "Node.js"
   - Copia el URL
4. En Railway Backend Variables, pega en MONGODB_URI
5. Espera nuevo deploy (2-3 min)
```

### Error 2: "CORS policy error" en frontend
```
Problema: CORS_ORIGIN no está configurado correctamente

Solución:
1. En Railway Backend Variables
2. Verifica CORS_ORIGIN sea EXACTAMENTE:
   https://mara-frontend-production.up.railway.app
3. Sin http:// (debe ser HTTPS)
4. Sin rutas extras
5. Sin "/" al final
6. Guarda y espera redeploy
```

### Error 3: "Cannot find module" en logs
```
Problema: Falta instalar dependencias

Solución:
1. En Railway, ve a "Settings"
2. Busca "Build Command" y verifica sea:
   npm install
3. Busca "Start Command" y verifica sea correcta
4. Fuerza un nuevo deploy (botón "Redeploy")
```

### Error 4: "Port already in use"
```
Problema: El puerto 4000 está en uso

Solución:
1. En Railway Backend Variables
2. NO fijes PORT = 4000
3. Déjalo que Railway asigne automáticamente
4. Redeploy
```

### Error 5: Login falla con "Invalid token"
```
Problema: JWT_SECRET no está configurado o es incorrecto

Solución:
1. En Railway Backend Variables
2. Verifica JWT_SECRET existe
3. Debe ser algo único y seguro (mínimo 32 caracteres)
4. JWT_REFRESH_SECRET puede ser igual o diferente
5. Redeploy
6. Intenta login de nuevo
```

---

## 📝 CHECKLIST DE VERIFICACIÓN

Marca lo que ya revisaste:

```
BACKEND:
[ ] Deployment status es ✅ verde
[ ] NODE_ENV = production
[ ] CORS_ORIGIN = https://mara-frontend-production.up.railway.app
[ ] MONGODB_URI configurado (no vacío)
[ ] JWT_SECRET configurado (no vacío)
[ ] /api/health devuelve {"ok":true}

FRONTEND:
[ ] Deployment status es ✅ verde
[ ] VITE_API_URL = https://mara-production-7e59.up.railway.app/api
[ ] Frontend carga sin errores en F12 Console
[ ] Login funciona con admin@sportify.com / Admin123!

VISUAL:
[ ] Tema claro con texto oscuro (#1f2937) visible
[ ] Botones "Cancelar" en rojo y visible
[ ] Status badges visibles y legibles
```

---

## 💾 SI NECESITAS AYUDA

Recopila esta información:

1. **Status de deployments:**
   - ¿Backend es ✅ o ❌?
   - ¿Frontend es ✅ o ❌?

2. **URL del health check:**
   - ¿Qué devuelve https://mara-production-7e59.up.railway.app/api/health?

3. **Error exacto:**
   - Copia el error de los logs o de la consola (F12)

4. **Variables configuradas:**
   - Pantallazos de Variables en Backend y Frontend

5. **¿Frontend carga?**
   - ¿Qué ves en la pantalla?
   - ¿Errores en la consola (F12)?

---

## 🔗 LINKS ÚTILES

- **Railway Dashboard:** https://railway.app
- **MongoDB Atlas:** https://cloud.mongodb.com
- **Frontend URL:** https://mara-frontend-production.up.railway.app
- **Backend API URL:** https://mara-production-7e59.up.railway.app/api
- **Health Check:** https://mara-production-7e59.up.railway.app/api/health

---

**Última actualización:** 2 JUL 2026  
**Cambios recientes:** Tema claro implementado, colores de contraste mejorados
