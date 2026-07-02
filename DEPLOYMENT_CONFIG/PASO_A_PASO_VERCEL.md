# 📸 Guía Paso a Paso - Vercel

> Instrucciones detalladas con ubicaciones exactas en la interfaz de Vercel

---

## 🎯 Objetivo

Añadir la variable de entorno `VITE_API_URL` en Vercel para que el frontend pueda conectar al backend en Railway.

---

## 📋 Requisitos Previos

- Tener acceso a Vercel Dashboard
- Tener el proyecto `mara-frontend-production` deployado en Vercel

---

## 🚀 Pasos

### PASO 1: Abre Vercel Dashboard

1. En tu navegador, ve a: **https://vercel.com/dashboard**
2. Inicia sesión si es necesario
3. Deberías ver una lista de tus proyectos

---

### PASO 2: Busca tu proyecto

1. En la página de proyectos, busca: **`mara-frontend-production`**
2. Puede estar en la lista principal o usa Ctrl+F para buscarlo
3. **Haz clic en el nombre del proyecto**

Ejemplo:
```
Projects
├─ mara-frontend-production  ← AQUÍ
├─ otro-proyecto
└─ otro-proyecto
```

---

### PASO 3: Abre Settings

Una vez que entres en el proyecto:

1. Mira la barra de opciones en la parte superior
2. Deberías ver: **Deployments**, **Settings**, **Analytics**, etc.
3. **Haz clic en "Settings"** (arriba a la derecha)

Ubicación típica:
```
[Deployments] [Settings] [Analytics] [Integrations]
                ↑
             AQUÍ
```

---

### PASO 4: Abre Environment Variables

1. En el menú de Settings, mira la **barra izquierda**
2. Busca **"Environment Variables"**
3. **Haz clic en ella**

La barra izquierda típicamente tiene:
```
General
Git
Build & Development Settings
Environment Variables  ← AQUÍ
Analytics
Billing
...
```

---

### PASO 5: Añade la Variable

Ahora estás en la página de Environment Variables.

**Método 1: Usando el botón "Add New"**

1. Busca el botón **"Add New Environment Variable"** (usualmente arriba o abajo de la lista)
2. **Haz clic en él**
3. Se abrirá un formulario

**Método 2: Si no ves el botón**

1. Busca un botón con un **símbolo "+" o "Add"**
2. O desplázate hasta el final de la página

---

### PASO 6: Completa el formulario

Cuando se abra el formulario, verás campos como estos:

```
Key/Name:    [______________]
Value:       [______________]
Scope:       [ ] Production
             [ ] Preview
             [ ] Development
```

**Rellena exactamente así:**

**Campo 1: Key/Name (Nombre de la variable)**
```
VITE_API_URL
```

**Campo 2: Value (Valor de la variable)**
```
https://mara-production-7e59.up.railway.app/api
```

**Campo 3: Scope (Aplicar a qué entornos)**

Selecciona TODAS las opciones:
- ✅ Production (marcar)
- ✅ Preview (marcar)
- ✅ Development (marcar)

---

### PASO 7: Guarda la Variable

1. Busca un botón que diga:
   - **"Save"** o
   - **"Add"** o
   - **"Create"**

2. **Haz clic en él**

3. Verás una notificación de confirmación (usualmente "✅ Variable added")

---

### PASO 8: Espera el Redeploy

Una vez guardada, **Vercel redeplegará automáticamente** tu proyecto.

**Verificar el redeploy:**

1. Vuelve a la pestaña principal del proyecto (click en "Deployments")
2. Deberías ver un nuevo deployment en la parte superior
3. Verá algo como:

   ```
   🟡 Building... (en progreso)
   ```

   Espera a que cambie a:

   ```
   ✅ Ready (listo)
   ```

4. **Esto toma ~1-2 minutos**

**No continúes hasta que veas ✅ Ready**

---

### PASO 9: Verifica que funciona

Una vez que Vercel diga ✅ Ready:

1. Abre en tu navegador:
   ```
   https://mara-frontend-production.up.railway.app/login
   ```

2. Deberías ver la página de login

3. **Prueba a loguear:**
   - Email: `admin@sportify.com`
   - Password: `Admin123!`

4. **Resultado esperado:**
   - ✅ Se acepta las credenciales
   - ✅ Redirige a `/perfil`
   - ✅ Muestra datos del usuario
   - ✅ NO hay error de conexión

---

## ✅ Verificación Técnica (Opcional)

Si quieres asegurarte de que la variable se aplicó correctamente:

### Test 1: Backend responde?

En el navegador, abre:
```
https://mara-production-7e59.up.railway.app/api/health
```

Deberías ver:
```json
{"ok":true}
```

Si ves timeout o error → El backend no está levantado

### Test 2: Frontend conecta?

1. En la página de login, abre **DevTools** (presiona F12)
2. Ve a la pestaña **Network**
3. Intenta loguear (completa el formulario y envía)
4. Busca un request que diga `/api/auth/login`
5. Haz clic en él
6. Mira la sección **"Request URL"**
7. Debería decir:

   ✅ CORRECTO:
   ```
   https://mara-production-7e59.up.railway.app/api/auth/login
   ```

   ❌ INCORRECTO:
   ```
   https://mara-frontend-production.up.railway.app/api/auth/login
   ```

Si ves el ❌ INCORRECTO → La variable `VITE_API_URL` no se aplicó (repite el proceso)

---

## 🔄 Si Algo Sale Mal

### Problema: No veo "Environment Variables" en Settings

**Solución:**
1. Asegúrate de estar en Settings del proyecto correcto
2. Mira la barra izquierda (puedes necesitar desplazarte)
3. Si no aparece, recarga la página (F5)

### Problema: El redeploy no termina

**Solución:**
1. Espera más tiempo (puede tomar 3-5 minutos)
2. Recarga la página de Deployments
3. Si ves "Failed", haz clic para ver los logs

### Problema: Sigue sin funcionar el login

**Solución:**
1. Lee: [`VERCEL_ENVIRONMENT_SETUP.md`](VERCEL_ENVIRONMENT_SETUP.md)
2. Verifica que el backend en Railway está levantado
3. Verifica que la URL es exacta: `https://mara-production-7e59.up.railway.app/api`

---

## 📝 Checklist Final

Marca cada paso cuando lo completes:

- [ ] Abrí https://vercel.com/dashboard
- [ ] Encontré el proyecto `mara-frontend-production`
- [ ] Entré en Settings
- [ ] Encontré "Environment Variables"
- [ ] Hice clic en "Add New Environment Variable"
- [ ] Llené el formulario con:
  - [ ] Key: `VITE_API_URL`
  - [ ] Value: `https://mara-production-7e59.up.railway.app/api`
  - [ ] Scope: Production, Preview, Development (todos marcados)
- [ ] Guardé la variable
- [ ] Esperé a que Vercel terminara (✅ Ready)
- [ ] Probé el login en https://mara-frontend-production.up.railway.app/login
- [ ] Login funciona ✅

---

## 🎉 ¡LISTO!

Si llegaste hasta aquí y el login funciona, **la configuración está correcta** ✅

Ahora puedes:
1. ✅ Confirmarme que funciona
2. ✅ Continuar con la revisión UX/UI final

---

**¿Problemas? Lee [`VERCEL_ENVIRONMENT_SETUP.md`](VERCEL_ENVIRONMENT_SETUP.md) para troubleshooting detallado.**
