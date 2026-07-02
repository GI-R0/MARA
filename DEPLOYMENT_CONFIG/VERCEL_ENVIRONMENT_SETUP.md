# 🚀 Configuración de Variables de Entorno - Vercel

**ESTADO:** 🔴 CRÍTICO - Frontend no puede conectar a Backend

---

## 📋 El Problema

Tu frontend en **Vercel** está intentando conectar a tu API local (`/api`) en lugar de tu backend en **Railway**.

### Síntoma:
- ❌ No se puede loguear
- ❌ No se puede registrar  
- ❌ Todos los requests a API fallan

### Causa:
En `frontend/sportifyclub-frontend/src/api/axiosConfig.js`:

```javascript
const baseURL = import.meta.env.VITE_API_URL || "/api";
```

**Cuando `VITE_API_URL` no está definida en Vercel:**
- Frontend usa `/api` (proxy local)
- En producción esto intenta ir a `https://mara-frontend-production.up.railway.app/api`
- Pero tu API está en `https://mara-production-7e59.up.railway.app/api` ❌

---

## ✅ SOLUCIÓN: Añadir Variable a Vercel

### Paso 1: Ir al Dashboard de Vercel

1. Abre [vercel.com/dashboard](https://vercel.com/dashboard)
2. Busca tu proyecto `mara-frontend-production`
3. Click en el proyecto

### Paso 2: Acceder a Environment Variables

1. Click en **Settings** (arriba)
2. En el menú izquierdo, busca **Environment Variables**
3. Click en **Environment Variables**

### Paso 3: Añadir la Variable

**Nombre:** `VITE_API_URL`

**Valor:** `https://mara-production-7e59.up.railway.app/api`

**Aplica a:** Selecciona todas las opciones (Production, Preview, Development)

**Pasos:**
1. Haz clic en el botón **"Add New Environment Variable"**
2. Copia y pega exactamente:
   ```
   Name: VITE_API_URL
   Value: https://mara-production-7e59.up.railway.app/api
   ```
3. Selecciona las opciones (todas)
4. Click en **Save**

---

## 🔄 Paso 4: Redeploy Automático

Una vez guardada la variable, **Vercel redeplegará automáticamente** tu proyecto.

**Espera a que termine:**
- Abre la pestaña **Deployments**
- Busca el deployment más reciente
- Espera a que diga "✅ Ready" (puede tomar 1-2 minutos)

---

## ✅ Verificación

Una vez que Vercel termine de redeplegar:

1. **En el navegador, abre:** https://mara-frontend-production.up.railway.app/login

2. **Intenta loguear:**
   - Email: `admin@sportify.com`
   - Password: `Admin123!`

3. **Debería:**
   - ✅ Aceptar las credenciales
   - ✅ Redirigir a `/perfil`
   - ✅ Mostrar datos del usuario
   - ✅ NO mostrar error de conexión

---

## 🔧 Verificación Técnica (DevTools)

Si quieres verificar que la variable se aplicó correctamente:

1. En la página de login, abre **DevTools** (F12)
2. Abre la pestaña **Network**
3. Haz un request cualquiera (intenta loguear o registrar)
4. Busca un request a `/api/...`
5. Verifica en **Request Headers**:
   - Debe decir: `https://mara-production-7e59.up.railway.app/api/...`
   - NO debe decir: `https://mara-frontend-production.up.railway.app/api/...`

---

## 🛑 Si Aún No Funciona

Verifica esto:

### 1. Backend está levantado?
```bash
# Abre cualquier navegador y copia esta URL:
https://mara-production-7e59.up.railway.app/api/health
```

Deberías ver una respuesta JSON (algo como `{"ok":true}`).

Si ves error o timeout → **El backend no está levantado**.

### 2. ¿Pusheaste los cambios a Git?

Si hiciste cambios locales pero no pusheaste:
```bash
git add .
git commit -m "Deploy configuration"
git push origin main  # o tu rama
```

Luego Vercel redeplegará automáticamente.

### 3. ¿La variable está correcta?

En Vercel Dashboard:
1. Ve a **Settings → Environment Variables**
2. Busca `VITE_API_URL`
3. Verifica que diga exactamente:
   ```
   https://mara-production-7e59.up.railway.app/api
   ```

### 4. ¿Esperaste a que Vercel terminara?

No abras la web hasta que veas "✅ Ready" en Deployments.

---

## 📝 También Revisa: CORS en Railway

Asegúrate de que tu backend en Railway tiene la variable:

```
CORS_ORIGIN = https://mara-frontend-production.up.railway.app
```

**Si no la tiene:**
1. Ve a Railway Dashboard
2. Tu proyecto → Variables
3. Busca `CORS_ORIGIN` o `FRONTEND_URL`
4. Si no existe, añádela

---

## 🎉 Una Vez que Funciona

Tu aplicación debería:
1. ✅ Mostrar login en https://mara-frontend-production.up.railway.app
2. ✅ Loguear usuarios exitosamente
3. ✅ Registrar usuarios nuevos
4. ✅ Ver perfil
5. ✅ Hacer reservas

---

**¿Necesitas ayuda? Verifica que seguiste cada paso exactamente como está escrito arriba.**
