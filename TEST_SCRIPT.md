# 🧪 Guía de Testing - Sportify Club

**Fecha:** 24 de junio de 2026

---

## 🚀 Paso 1: Iniciar Backend

**Abre una terminal y ejecuta:**

```bash
cd D:\sportify\sportifyclub\backend
npm start
```

**Esperado:** Deberías ver:
```
✅ Conectado a MongoDB
Servidor corriendo en 0.0.0.0:4000
```

**Si ves error de MongoDB:**
- Verifica que MongoDB está corriendo localmente
- O que tienes conexión a MongoDB Atlas
- Verifica la variable `MONGODB_URI` en `.env`

---

## 🚀 Paso 2: Iniciar Frontend

**Abre otra terminal y ejecuta:**

```bash
cd D:\sportify\sportifyclub\frontend\sportifyclub-frontend
npm run dev
```

**Esperado:** Deberías ver:
```
  ➜  Local:   http://localhost:5173/
```

---

## 🧪 Paso 3: Testing Manual

### Test 1: Verificar Backend está activo

En tu navegador o terminal ejecuta:
```bash
curl http://localhost:4000/health
```

**Esperado:**
```json
{"ok":true}
```

---

### Test 2: Crear cuenta (Registro)

1. Ve a: http://localhost:5173/register
2. Llena el formulario:
   - Nombre: `Test User`
   - Email: `testuser_<timestamp>@example.com` (ej: testuser_20260624@example.com)
   - Contraseña: `TestPass123!`
   - Confirmar: `TestPass123!`
3. Click en "Crear Cuenta"

**Esperado:**
- ✅ Redirige a dashboard (/)
- ✅ Muestra "¡Cuenta creada con éxito!"
- ✅ Usuario autenticado (no va a login)

**Si falla:**
- Revisa console del navegador (F12 → Console)
- Revisa logs del backend

---

### Test 3: Iniciar Sesión

1. Ve a: http://localhost:5173/login
2. Email: `<el que creaste en Test 2>`
3. Contraseña: `TestPass123!`
4. Click "Iniciar Sesión"

**Esperado:**
- ✅ Redirige a dashboard (/)
- ✅ Muestra datos del usuario
- ✅ Botones de navegación disponibles

---

### Test 4: Validación de Contraseña

1. Ve a: http://localhost:5173/register
2. Intenta crear cuenta con:
   - Email: `test2@example.com`
   - Contraseña: `Test` (demasiado corta)

**Esperado:**
- ✅ Placeholder muestra: "Mínimo 8 caracteres: mayúscula, minúscula, número y símbolo (@$!%*?&)"
- ✅ Botón "Crear Cuenta" está deshabilitado
- ✅ Vea lista de requisitos pendientes

---

### Test 5: Auto-login después de Registro

1. Ve a: http://localhost:5173/register
2. Crea una cuenta nueva (email único)
3. Click "Crear Cuenta"

**Esperado:**
- ✅ NO te pide login nuevamente
- ✅ Vas directo al dashboard autenticado
- ✅ Puedes ver tu nombre en la página

---

### Test 6: Logouts Accidentales (CRÍTICO)

1. Inicia sesión
2. Ve a: http://localhost:5173/perfil
3. Click en "Mis Reservas"

**Esperado:**
- ✅ Navegas a Mis Reservas
- ✅ NO eres deslogueado
- ✅ Ves la página (con reservas o "sin reservas")

**Si ves logout accidental:**
- ❌ Problema - revisa console y logs

---

### Test 7: Validación de Tiempo en Reservas

1. Inicia sesión
2. Ve a: http://localhost:5173/reservas
3. Selecciona una pista y fecha HOY

**Esperado:**
- ✅ Dropdown de horarios solo muestra aquellos con +2 horas
- ✅ Si son las 16:00, no ves horarios antes de 18:00

**Ejemplo:**
```
Hora actual: 16:00
Horarios visibles: 18:00, 19:00, 20:00 (solo estos)
Horarios NO visibles: 16:00, 17:00, 17:30 (menos de 2 horas)
```

---

### Test 8: Botones Admin

1. Inicia sesión como ADMIN (si existe)
   - O crea uno en DB manualmente
2. Ve a: http://localhost:5173/admin/usuarios

**Esperado:**
- ✅ Título "Usuarios" está centrado
- ✅ Botón "Volver al panel" es visible a la derecha
- ✅ NO están superpuestos
- ✅ Tabla muestra usuarios

**Hover sobre botones:**
- ✅ Se agrandar ligeramente
- ✅ NO se superponen

---

### Test 9: Carga de Datos

1. Como ADMIN, ve a:
   - http://localhost:5173/admin/usuarios → ✅ Carga usuarios
   - http://localhost:5173/admin/reservas → ✅ Carga reservas
   - http://localhost:5173/pistas/gestion → ✅ Carga pistas

**Esperado:**
- ✅ Cada página muestra datos en tabla
- ✅ NO dice "Cargando..." indefinidamente

---

## 🐛 Debugging

### Si Backend no conecta a MongoDB

```bash
# Verifica que MongoDB está corriendo
# En Windows, busca "MongoDB" en Services
# O verifica MongoDB Atlas en https://cloud.mongodb.com/

# Revisa tu .env en backend/
cat backend/.env
# Debe tener: MONGODB_URI=<tu_uri>
```

### Si Frontend no carga

```bash
# Limpia caché y node_modules
cd frontend/sportifyclub-frontend
rm -r node_modules
npm install
npm run dev
```

### Para ver logs detallados

**Backend (ya está en backend.log):**
```bash
tail -f backend/backend.log
```

**Frontend (en consola de navegador):**
- Abre DevTools: F12
- Ve a Console tab
- Busca errores rojos

---

## ✅ Checklist Final

- [ ] Backend inicia sin errores (puerto 4000)
- [ ] Frontend inicia sin errores (puerto 5173)
- [ ] Puedo crear cuenta y auto-login funciona
- [ ] Puedo iniciar sesión
- [ ] Validación de contraseña es clara
- [ ] No hay logouts accidentales
- [ ] Validación de 2 horas en reservas funciona
- [ ] Botones admin están visibles y separados
- [ ] Datos cargan correctamente
- [ ] No hay errores en console

---

## 📞 Si Hay Problemas

1. **Proporciona:**
   - Mensajes de error exactos
   - Capturas de pantalla
   - Logs de la consola (DevTools → Console)

2. **Revisar:**
   - Variables de ambiente (.env)
   - Conexión a MongoDB
   - Puertos 4000 y 5173 disponibles

3. **Reiniciar:**
   - Cierra ambos servidores (Ctrl+C)
   - Borra carpeta `node_modules`
   - `npm install` en ambas carpetas
   - Vuelve a iniciar

---

**¡Listo para testing!** 🚀

