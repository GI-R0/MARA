# 🧪 PRUEBAS COMPLETAS DE RAILWAY - FRONTEND Y BACKEND

## 📋 CHECKLIST DE PRUEBAS

Sigue este checklist para validar que todo funciona en producción.

---

## 🔴 PASO 1: VERIFICAR BACKEND

### Test 1.1: Health Check
```
URL: https://mara-production-7e59.up.railway.app/api/health

¿Qué deberías ver?
{
  "ok": true
}

Status: ✅ OK o ❌ FAIL
```

### Test 1.2: Revisar Deployment Status
```
1. Ve a https://railway.app
2. Proyecto: mara-production-7e59
3. Busca "Deployments"
4. ¿El último deploy es ✅ verde o ❌ rojo?

Status: ✅ RUNNING o ❌ FAILED
```

### Test 1.3: Revisar Logs
```
Si hay error:
1. Haz clic en el deploy
2. Ve a "Logs"
3. Busca líneas rojas
4. Copia el error exacto
```

---

## 🌐 PASO 2: VERIFICAR FRONTEND

### Test 2.1: ¿Carga la aplicación?
```
URL: https://mara-frontend-production.up.railway.app

¿Qué deberías ver?
- Página de inicio con navbar
- Logo de SportifyClub
- Botones de navegación
- Tema CLARO con texto oscuro (#1f2937)

Status: ✅ CARGA o ❌ ERROR
```

### Test 2.2: Revisar Consola (F12)
```
1. Abre: https://mara-frontend-production.up.railway.app
2. Presiona F12 (Developer Tools)
3. Ve a la pestaña "Console"
4. ¿Hay errores en rojo?

Busca errores de:
- CORS (Access-Control)
- 404 (API endpoints)
- Network errors

Status: ✅ SIN ERRORES o ❌ ERRORES ENCONTRADOS
```

### Test 2.3: Revisar Deployment Frontend
```
1. Ve a https://railway.app
2. Proyecto: mara-frontend-production
3. Busca "Deployments"
4. ¿El último deploy es ✅ verde?

Status: ✅ OK o ❌ FAILED
```

---

## 🔐 PASO 3: PRUEBA DE LOGIN

### Test 3.1: Ir a Login
```
1. En la página principal
2. Busca botón "Iniciar Sesión" o similar
3. ¿Se abre el formulario de login?

Status: ✅ ABRE o ❌ ERROR
```

### Test 3.2: Intentar Login
```
Email:    admin@sportify.com
Password: Admin123!

¿Qué pasa?
- ✅ LOGIN EXITOSO: Te redirige al dashboard
- ❌ ERROR DE CONEXIÓN: Backend no conecta
- ❌ ERROR 401: Credenciales incorrectas
- ❌ ERROR 403: Sin permisos

Copia el error exacto si falla.

Status: ✅ LOGUEADO o ❌ ERROR
```

### Test 3.3: Revisar Consola (F12)
```
Si el login falla:
1. Presiona F12
2. Ve a "Network"
3. Intenta loguear de nuevo
4. Busca request POST a /auth/login
5. ¿Qué status devuelve? (200, 401, 403, 500, etc.)
6. ¿Cuál es el error exacto?

Status: ✅ VER RESPUESTA o ❌ ERROR
```

---

## 📊 PASO 4: FUNCIONALIDADES PRINCIPALES

### Test 4.1: Dashboard/Home
```
Después de loguear:
- ¿Ves tu nombre de usuario?
- ¿Hay estadísticas (cards de números)?
- ¿Hay menú lateral?
- ¿Los colores están en tema CLARO?

Status: ✅ VISIBLE y CLARO o ❌ PROBLEMAS
```

### Test 4.2: Navegar a Pistas
```
1. Busca "Pistas" en la navegación
2. ¿Se carga la lista de pistas?
3. ¿Ves tarjetas con nombres, precios, deportes?
4. ¿Las imágenes cargan?
5. ¿El tema claro se ve bien?

Status: ✅ FUNCIONA o ❌ ERROR
```

### Test 4.3: Ver Detalles de Pista
```
1. Haz clic en una pista
2. ¿Se abre la página de detalles?
3. ¿Ves:
   - Nombre de la pista
   - Imagen
   - Precio
   - Horarios disponibles
   - Botón "Reservar"

Status: ✅ CARGA BIEN o ❌ ERROR
```

### Test 4.4: Hacer una Reserva
```
1. En detalles de pista, busca "Reservar"
2. Selecciona una fecha y hora
3. Haz clic en "Confirmar Reserva"
4. ¿Se completa la reserva?
5. ¿Te redirige a "Mis Reservas"?

Status: ✅ RESERVA EXITOSA o ❌ ERROR
```

### Test 4.5: Ver Mis Reservas
```
1. Ve a "Mis Reservas"
2. ¿Ves la reserva que creaste?
3. ¿El estado es "pendiente" o "confirmada"?
4. ¿Se ven:
   - Nombre de la pista
   - Fecha y hora
   - Precio
   - Botones (Confirmar, Cancelar)

Status: ✅ VISIBLE o ❌ ERROR
```

---

## 👥 PASO 5: FUNCIONALIDADES DE ROL ADMIN

### Test 5.1: Ir a Admin Panel
```
(Debes estar logueado como admin)

1. Busca en el menú: "Administrador" o "Admin Panel"
2. ¿Se abre el panel?
3. ¿Ves:
   - Estadísticas globales
   - Botones: Usuarios, Pistas, Reservas

Status: ✅ ABRE o ❌ ERROR
```

### Test 5.2: Ver Usuarios
```
1. En Admin Panel, haz clic en "Usuarios"
2. ¿Se carga la tabla de usuarios?
3. ¿Ves:
   - Nombres
   - Emails
   - Roles
   - Botones de acciones

Status: ✅ TABLA CARGA o ❌ ERROR
```

### Test 5.3: Ver Reservas (Admin)
```
1. En Admin Panel, haz clic en "Reservas"
2. ¿Se carga la tabla?
3. ¿Ves:
   - ID de reserva
   - Usuario
   - Pista
   - Fecha y hora
   - Estado
   - Botones de acciones (Confirmar, Cancelar, Eliminar)

Status: ✅ TABLA CARGA o ❌ ERROR
```

---

## 🎨 PASO 6: VERIFICAR TEMA CLARO Y COLORES

### Test 6.1: Tema General
```
¿El fondo es claro?
- Fondo: Blanco o gris muy claro ✅
- Texto: Oscuro (#1f2937) ✅
- ¿Se lee bien?

Status: ✅ TEMA CLARO VISIBLE o ❌ PROBLEMA
```

### Test 6.2: Botones y Badges
```
En "Mis Reservas" o "Admin Panel":
- ¿Botón "Cancelar" es ROJO y visible? ✅
- ¿Status badge "pendiente" es ROJO y visible? ✅
- ¿Status badge "confirmada" es VERDE? ✅
- ¿Se leen bien todos los textos?

Status: ✅ COLORES BIEN o ❌ CONTRASTE MALO
```

### Test 6.3: Inputs y Formularios
```
En cualquier formulario:
- ¿Los inputs tienen fondo blanco?
- ¿El texto es oscuro y legible?
- ¿Los placeholders se ven?
- ¿El border es visible?

Status: ✅ FORMULARIOS BIEN o ❌ PROBLEMA
```

---

## 📱 PASO 7: RESPONSIVE (MÓVIL)

### Test 7.1: Reducir Ventana
```
1. Presiona F12
2. Haz clic en el ícono de "responsive" (teléfono)
3. Selecciona "iPhone 12" o "Tablet"
4. ¿Se ve bien en móvil?
5. ¿Los menús se colapsan?
6. ¿Se puede hacer scroll?

Status: ✅ RESPONSIVE OK o ❌ PROBLEMAS
```

### Test 7.2: Prueba en Móvil Real
```
(Si tienes un teléfono)

1. Abre: https://mara-frontend-production.up.railway.app
2. ¿Se ve bien?
3. ¿Se pueden hacer tap sin problemas?
4. ¿Los botones son clicables?

Status: ✅ FUNCIONA EN MÓVIL o ❌ PROBLEMA
```

---

## 🔴 PASO 8: PRUEBA DE REGISTRO

### Test 8.1: Registro Nuevo Usuario
```
1. Cierra sesión (si estás logueado)
2. Busca "Registrarse" o "Sign Up"
3. Completa el formulario:
   - Nombre: Test User
   - Email: test@test.com
   - Contraseña: Test1234!
   - Repetir contraseña: Test1234!

4. Haz clic en "Registrarse"
5. ¿Se crea la cuenta?
6. ¿Te redirige a login?

Status: ✅ REGISTRO EXITOSO o ❌ ERROR
```

### Test 8.2: Loguear con Nueva Cuenta
```
1. Email: test@test.com
2. Password: Test1234!
3. ¿Logueaste exitosamente?

Status: ✅ LOGIN OK o ❌ ERROR
```

---

## 📊 PASO 9: PRUEBA DE ERRORES

### Test 9.1: Intenta Login con Datos Malos
```
Email:    admin@sportify.com
Password: WrongPassword123!

¿Qué pasa?
- ✅ Muestra error "Credenciales inválidas"
- ❌ No muestra error claro
- ❌ Página se queda congelada

Status: ✅ ERROR CLARO o ❌ CONFUSO
```

### Test 9.2: Intenta Registrar con Email Existente
```
1. Intenta registrarse con: admin@sportify.com
2. ¿Qué pasa?
   - ✅ Muestra error "Email ya existe"
   - ❌ No muestra error claro

Status: ✅ ERROR CLARO o ❌ CONFUSO
```

---

## 📋 RESUMEN FINAL

Marca lo que verificaste:

```
BACKEND:
[ ] Health check responde {"ok":true}
[ ] Deployment es ✅ verde
[ ] No hay errores en logs

FRONTEND:
[ ] Página carga sin errores
[ ] Tema claro visible
[ ] Console (F12) sin errores rojos
[ ] Deployment es ✅ verde

LOGIN:
[ ] Login funciona con admin@sportify.com
[ ] Formulario de login se ve bien
[ ] Mensajes de error claros

FUNCIONALIDADES:
[ ] Dashboard carga después de login
[ ] Pistas se cargan correctamente
[ ] Puedo ver detalles de una pista
[ ] Puedo hacer una reserva
[ ] Puedo ver "Mis Reservas"
[ ] Admin panel funciona

COLORES Y UI:
[ ] Tema claro en toda la app
[ ] Texto oscuro (#1f2937) legible
[ ] Botones "Cancelar" en ROJO
[ ] Badges de estado visibles
[ ] Responsive funciona en móvil

TOTAL: ___/40 pruebas pasadas
```

---

## 🐛 SI ENCUENTRAS ERRORES

Copia esta información:

```
1. URL donde falla:
   

2. Error exacto (F12 Console o red):
   

3. Steps to reproduce:
   

4. Expected vs Actual:
   

5. Screenshots/logs:
   
```

---

## 🎯 ESTADO ESPERADO

✅ **TODO DEBE FUNCIONAR:**
- Backend responde en /api/health
- Frontend carga sin errores
- Login funciona
- Puedo hacer reservas
- Admin panel funciona
- Tema claro visible en toda la app
- Responsive en móvil
- Botones y badges con colores correctos

---

**Instrucciones: Sigue el checklist anterior y reporta qué funciona y qué no**
