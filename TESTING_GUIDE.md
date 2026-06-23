# 🧪 GUÍA DE PRUEBAS

## Verificación de Cambios

---

## Test 1: Endpoint de Usuarios ✅

### 1.1 Usando cURL
```bash
# Obtener el token primero
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "password123"}' \
  -c cookies.txt

# Luego obtener usuarios
curl -X GET http://localhost:3000/api/auth/users \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -b cookies.txt
```

### 1.2 Respuesta Esperada
```json
{
  "users": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-20T14:22:00Z"
    }
  ]
}
```

### 1.3 Checklist
- [ ] Respuesta status 200
- [ ] Contiene propiedad `users`
- [ ] `users` es un array
- [ ] Cada usuario tiene `_id`, `name`, `email`, `role`
- [ ] AdminUsers.jsx parsea correctamente con `res.data.users`

---

## Test 2: Endpoint de Pistas - General ✅

### 2.1 Usando cURL
```bash
curl -X GET "http://localhost:3000/api/pistas?page=1&limit=10" \
  -H "Content-Type: application/json"
```

### 2.2 Respuesta Esperada
```json
{
  "pistas": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "nombre": "Pista Central",
      "deporte": "Pádel",
      "ubicacion": "Zona Norte",
      "precioHora": 25,
      "horariosDisponibles": ["09:00", "10:00", "11:00"],
      "iluminacion": true,
      "superficie": "Cemento",
      "imagen": "https://...",
      "club": {
        "_id": "507f1f77bcf86cd799439001",
        "name": "Club Deportivo"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  }
}
```

### 2.3 Checklist
- [ ] Respuesta status 200
- [ ] Contiene `pistas` y `pagination`
- [ ] `pistas` es un array
- [ ] Cada pista tiene los campos esperados
- [ ] Frontend parsea con `res.data.pistas`

---

## Test 3: Endpoint de Pistas por Club ✅

### 3.1 Usando cURL
```bash
# Necesitas un token de club
curl -X GET http://localhost:3000/api/pistas/club/CLUB_ID \
  -H "Authorization: Bearer YOUR_CLUB_TOKEN" \
  -b cookies.txt
```

### 3.2 Respuesta Esperada
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "nombre": "Pista Central",
    "deporte": "Pádel",
    "ubicacion": "Zona Norte",
    "precioHora": 25,
    "horariosDisponibles": ["09:00", "10:00", "11:00"],
    "iluminacion": true,
    "superficie": "Cemento",
    "imagen": "https://...",
    "club": {
      "_id": "CLUB_ID",
      "name": "Mi Club"
    }
  }
]
```

### 3.3 Checklist
- [ ] Respuesta status 200
- [ ] Es un array directo (NO tiene `pistas` ni `pagination`)
- [ ] Cada pista tiene los campos esperados
- [ ] Pertenecen al club especificado
- [ ] Frontend parsea correctamente con `res.data.pistas || res.data`

---

## Test 4: Frontend - Página de Usuarios

### 4.1 Pasos Manuales
1. Acceder a http://localhost:5173/admin/usuarios (requiere login como admin)
2. Esperar a que cargue
3. Verificar que aparezca tabla con usuarios

### 4.2 Elementos a Verificar
- [ ] No aparece error "No se pudieron cargar los usuarios"
- [ ] La tabla se renderiza correctamente
- [ ] Se muestran todos los usuarios
- [ ] Columnas: Nombre, Email, Rol, Registrado, Última actualización, Acciones
- [ ] Botón "Eliminar" está disponible
- [ ] Select de rol funciona para cambiar roles

### 4.3 Consola del Navegador
```javascript
// En Developer Tools > Console
// Verificar que no hay errores de CORS o parsing
console.log("AdminUsers debería funcionar sin errores")
```

---

## Test 5: Frontend - Página de Pistas

### 5.1 Pasos Manuales (Como Club)
1. Acceder a http://localhost:5173/pistas/gestion (requiere login como club)
2. Esperar a que cargue
3. Verificar que aparezca grid con pistas

### 5.2 Elementos a Verificar
- [ ] No aparece error "No se pudieron cargar las pistas"
- [ ] El grid se renderiza correctamente
- [ ] Se muestran todas las pistas del club
- [ ] Cada tarjeta muestra: imagen, nombre, deporte, ubicación, precio, acciones
- [ ] Botón "Editar" funciona
- [ ] Botón "Eliminar" funciona
- [ ] Botón "Nueva Pista" funciona

### 5.3 Pasos Manuales (Como Admin)
1. Acceder a http://localhost:5173/pistas/gestion (requiere login como admin)
2. Esperar a que cargue
3. Verificar que aparezca grid con TODAS las pistas

### 5.4 Diferencias esperadas
- [ ] Club ve solo sus pistas
- [ ] Admin ve todas las pistas
- [ ] El número de pistas es diferente entre club y admin

---

## Test 6: Validación de Formato Frontend

### 6.1 Test de Robustez
```javascript
// En console del navegador (GestionPistas)

// Simular respuesta con paginación
const res1 = { data: { pistas: [1, 2, 3], pagination: {} } };
const pistasList1 = res1.data.pistas || res1.data;
console.log(Array.isArray(pistasList1) ? "✅ OK" : "❌ FAIL"); // ✅ OK

// Simular respuesta sin paginación
const res2 = { data: [4, 5, 6] };
const pistasList2 = res2.data.pistas || res2.data;
console.log(Array.isArray(pistasList2) ? "✅ OK" : "❌ FAIL"); // ✅ OK

// Simular respuesta vacía
const res3 = { data: [] };
const pistasList3 = res3.data.pistas || res3.data;
console.log(Array.isArray(pistasList3) ? "✅ OK" : "❌ FAIL"); // ✅ OK
```

---

## Test 7: Verificación de Seguridad

### 7.1 Intentar acceso sin autenticación
```bash
# Debería retornar 401 Unauthorized
curl -X GET http://localhost:3000/api/auth/users
# Expected: 401 - Token requerido

curl -X GET http://localhost:3000/api/pistas/club/CLUB_ID
# Expected: 401 - Token requerido
```

### 7.2 Intentar acceso sin rol correcto
```bash
# Loguear como user normal, intentar acceder a admin
curl -X GET http://localhost:3000/api/auth/users \
  -H "Authorization: Bearer USER_TOKEN"
# Expected: 403 - Forbidden (no es admin)
```

### 7.3 Checklist de Seguridad
- [ ] `/auth/users` requiere token
- [ ] `/auth/users` requiere rol admin
- [ ] `/pistas/club/:id` requiere token
- [ ] `/pistas` es público (sin token)

---

## Test 8: Performance

### 8.1 Medir tiempo de carga
```javascript
// En console del navegador
const start = performance.now();
// ... hacer fetch ...
const end = performance.now();
console.log(`Tiempo: ${end - start}ms`);
// Esperado: < 500ms
```

### 8.2 Verificar Network en DevTools
1. Abrir DevTools > Network
2. Limpiar historial
3. Navegar a page
4. Verificar:
   - [ ] `/auth/users` tarda < 200ms
   - [ ] `/pistas/club/:id` tarda < 200ms
   - [ ] No hay errores 5xx

---

## Test 9: Casos Edge

### 9.1 Club sin pistas
```javascript
// Esperado: Grid vacío con mensaje "No hay pistas registradas aún"
// Botón "Crear la primera pista" disponible
```

### 9.2 Admin sin usuarios
```javascript
// Esperado: Tabla vacía con mensaje "No hay usuarios registrados"
// Pero típicamente siempre hay al menos el admin
```

### 9.3 Pistas con datos faltantes
```javascript
// Ejemplo: Pista sin imagen
// Esperado: Se muestra placeholder
// Ejemplo: Pista sin ubicación
// Esperado: Se muestra "Sin ubicación"
```

---

## Test 10: Flujo Completo

### 10.1 Como Club
```
1. ✅ Login como club
   └─ POST /auth/login
2. ✅ Ir a /pistas/gestion
   └─ GET /pistas/club/:clubId
3. ✅ Ver mis pistas
   └─ Renderizar grid
4. ✅ Crear pista
   └─ POST /pistas
5. ✅ Editar pista
   └─ PUT /pistas/:id
6. ✅ Eliminar pista
   └─ DELETE /pistas/:id
```

### 10.2 Como Admin
```
1. ✅ Login como admin
   └─ POST /auth/login
2. ✅ Ir a /admin/usuarios
   └─ GET /auth/users
3. ✅ Ver todos usuarios
   └─ Renderizar tabla
4. ✅ Cambiar rol usuario
   └─ PUT /auth/users/:id
5. ✅ Eliminar usuario
   └─ DELETE /auth/users/:id
6. ✅ Ir a /pistas/gestion
   └─ GET /pistas
7. ✅ Ver todas pistas
   └─ Renderizar grid
```

---

## Checklist Final ✅

- [ ] Backend iniciado sin errores
- [ ] Frontend iniciado sin errores
- [ ] AdminUsers carga usuarios correctamente
- [ ] GestionPistas carga pistas correctamente
- [ ] Endpoints retornan datos con formato correcto
- [ ] Seguridad funciona (401/403 cuando corresponde)
- [ ] No hay errores en consola
- [ ] Performance es aceptable (< 500ms)
- [ ] Todos los botones funcionan
- [ ] Cambios persisten en DB

---

## Comandos Rápidos

```bash
# Terminal 1: Backend
cd sportifyclub/backend
npm start

# Terminal 2: Frontend
cd sportifyclub/frontend/sportifyclub-frontend
npm run dev

# Terminal 3: Logs
cd sportifyclub/backend
tail -f logs/backend.log

# Test rápido de API
curl -X GET http://localhost:3000/api/pistas | jq
```

---

**Generado:** 2026-06-24  
**Última Actualización:** 2026-06-24
