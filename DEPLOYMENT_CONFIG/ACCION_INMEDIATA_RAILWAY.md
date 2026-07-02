# 🚀 Acción Inmediata - Railway (Ambos en Railway)

**SITUACIÓN:** Frontend y Backend están ambos en Railway.  
**PROBLEMA:** Faltan variables de entorno en ambos proyectos.  
**SOLUCIÓN:** Añadir 2 variables (5 minutos).

---

## 🎯 Resumen del Problema

```
❌ Frontend no conecta a Backend
   Causa: VITE_API_URL no existe en Frontend Railway

❌ Backend rechaza requests del Frontend  
   Causa: CORS_ORIGIN no apunta a la URL correcta en Backend Railway
```

---

## ✅ Solución Paso a Paso

### PASO 1: Backend Railway (mara-production)

1. Ve a: **https://railway.app/dashboard**
2. Haz clic en proyecto: **mara-production**
3. Haz clic en **Variables** o **Environment**

#### Verifica/Añade: `CORS_ORIGIN`

Si existe, edítala:
```
CORS_ORIGIN = https://mara-frontend-production.up.railway.app
```

Si NO existe, añádela:
1. Busca botón "+ Add Variable" o "+"
2. Name: `CORS_ORIGIN`
3. Value: `https://mara-frontend-production.up.railway.app`
4. Click Save

#### Verifica: `NODE_ENV`

Debe existir:
```
NODE_ENV = production
```

**Guarda los cambios.** Railway redeplegará automáticamente.

---

### PASO 2: Frontend Railway (mara-frontend-production)

1. Ve a: **https://railway.app/dashboard**
2. Haz clic en proyecto: **mara-frontend-production**
3. Haz clic en **Variables** o **Environment**

#### Verifica/Añade: `VITE_API_URL`

Si existe, edítala:
```
VITE_API_URL = https://mara-production-7e59.up.railway.app/api
```

Si NO existe, añádela:
1. Busca botón "+ Add Variable" o "+"
2. Name: `VITE_API_URL`
3. Value: `https://mara-production-7e59.up.railway.app/api`
4. Click Save

**Guarda los cambios.** Railway redeplegará automáticamente.

---

### PASO 3: Espera a que ambos Redeploy terminen

Para cada proyecto Railway:
1. Click en **Deployments**
2. Busca el deployment más reciente
3. Espera a que diga ✅ **Success** o **Running**

(Toma ~1-2 minutos por proyecto)

---

### PASO 4: Prueba Conexión

**Test 1: Backend levantado?**
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
URL: https://mara-frontend-production.up.railway.app/login

Email: admin@sportify.com
Password: Admin123!

→ Debe aceptar y mostrar perfil
```

**Test 4: Registro funciona?**
```
Nombre: Test User
Email: test@example.com
Password: TestPass123!

→ Debe crear cuenta y loguear automáticamente
```

---

## ✅ Si Todo Funciona

Todos los tests pasan ✅
- Login funciona
- Registro funciona
- Puedo ver mi perfil

→ **Confirma:** "Ya funciona todo, listo para revisión UX/UI"

---

## ❌ Si Algo Falla

### "Backend no responde en /api/health"

El backend no está levantado:
1. Ve a Railway Dashboard
2. Proyecto mara-production
3. Click en Deployments
4. ¿Hay un error rojo?
5. Si sí, haz clic para ver logs

### "Frontend no carga o da error"

Frontend no está levantado:
1. Ve a Railway Dashboard
2. Proyecto mara-frontend-production
3. Click en Deployments
4. ¿Hay un error rojo?
5. Si sí, haz clic para ver logs

### "Login funciona pero muestra error de conexión"

Probablemente CORS_ORIGIN está incorrecto:
1. Backend Railway → Variables
2. Verifica: `CORS_ORIGIN = https://mara-frontend-production.up.railway.app`
3. Si está incorrecto, edita y guarda
4. Espera redeploy

### "Registro no funciona"

Mismo problema que login (CORS_ORIGIN):
1. Verifica CORS_ORIGIN
2. Verifica VITE_API_URL
3. Espera redeploy
4. Prueba de nuevo

---

## 📝 Checklist

- [ ] Abrí Railway Dashboard
- [ ] Entré en proyecto Backend (mara-production)
- [ ] Añadí/Verifiqué `CORS_ORIGIN = https://mara-frontend-production.up.railway.app`
- [ ] Verifiqué `NODE_ENV = production`
- [ ] Guardé los cambios
- [ ] Entré en proyecto Frontend (mara-frontend-production)
- [ ] Añadí/Verifiqué `VITE_API_URL = https://mara-production-7e59.up.railway.app/api`
- [ ] Guardé los cambios
- [ ] Esperé a que ambos redeploy terminaran
- [ ] Probé Backend: /api/health = {"ok":true} ✅
- [ ] Probé Frontend: Carga página ✅
- [ ] Probé Login: Funciona ✅
- [ ] Probé Registro: Funciona ✅

---

## 🎉 ¡LISTO!

Si todos los tests pasan, tu despliegue está funcional. Confirma y continuamos con la revisión UX/UI final.

---

**¿Tienes problemas? Lee: `CONFIGURACION_RAILWAY_CORRECTA.md`**
