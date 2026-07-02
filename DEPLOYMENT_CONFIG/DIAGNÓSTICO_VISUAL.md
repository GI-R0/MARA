# 📊 Diagnóstico Visual del Problema

## 🔴 Situación Actual (ROTA)

```
┌─────────────────────────────────────────────────────────┐
│ Usuario abre: https://mara-frontend-production...       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Frontend React (Vercel)                               │
│  ├─ axiosConfig.js                                      │
│  │  └─ baseURL = import.meta.env.VITE_API_URL || "/api" │
│  │     ↓                                                 │
│  │  VITE_API_URL = undefined                            │
│  │  ↓ (usa fallback)                                     │
│  │  baseURL = "/api"  ❌ LOCAL (incorrecto)             │
│  │                                                      │
│  └─ Request a /api/auth/login                          │
│     ↓                                                    │
│     https://mara-frontend-prod.up.railway.app/api       │
│     ❌ INCORRECTO - No existe aquí                      │
│                                                         │
│  Backend (Railway) en:                                  │
│  https://mara-production-7e59.up.railway.app/api        │
│  ✅ Está levantado, pero frontend no lo sabe           │
│                                                         │
│  Resultado: ❌ Error de conexión en login/registro      │
└─────────────────────────────────────────────────────────┘
```

---

## ✅ Situación Deseada (CORRECTA)

```
┌──────────────────────────────────────────────────────────┐
│ Usuario abre: https://mara-frontend-production...        │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Frontend React (Vercel)                                │
│  ├─ axiosConfig.js                                       │
│  │  └─ baseURL = import.meta.env.VITE_API_URL || "/api"  │
│  │     ↓                                                  │
│  │  VITE_API_URL = "https://mara-production-..."         │
│  │  ✅ ENCONTRADA                                        │
│  │  ↓                                                     │
│  │  baseURL = "https://mara-production-7e59..."          │
│  │                                                       │
│  └─ Request a /auth/login                              │
│     ↓                                                     │
│     https://mara-production-7e59.up.railway.app/api/...  │
│     ✅ CORRECTO - Backend responde                       │
│                                                          │
│  Backend (Railway) en:                                   │
│  https://mara-production-7e59.up.railway.app/api         │
│  ✅ Está levantado y comunicando                         │
│                                                          │
│  Resultado: ✅ Login y registro funcionan               │
└──────────────────────────────────────────────────────────┘
```

---

## 🔧 El Cambio Necesario

### Archivo: Vercel Dashboard → Environment Variables

| Acción | Valor |
|--------|-------|
| **Agregar variable** | `VITE_API_URL` |
| **Con valor** | `https://mara-production-7e59.up.railway.app/api` |
| **Vercel redeploy** | ✅ Automático |

**¡Eso es todo!**

---

## 📍 Flujo de Datos - Antes vs Después

### ANTES (❌ Roto)
```
Usuario Login
    ↓
Frontend: ¿Cuál es la URL de la API?
    ↓
axiosConfig.js: Busco VITE_API_URL
    ↓
Vercel: No la encuentro 🤷
    ↓
axiosConfig.js: Uso fallback "/api"
    ↓
Request a: https://mara-frontend-prod.../api/auth/login
    ↓
❌ No existe en ese servidor
```

### DESPUÉS (✅ Correcto)
```
Usuario Login
    ↓
Frontend: ¿Cuál es la URL de la API?
    ↓
axiosConfig.js: Busco VITE_API_URL
    ↓
Vercel: Aquí está: https://mara-production-7e59...
    ↓
axiosConfig.js: Uso ese valor
    ↓
Request a: https://mara-production-7e59.../api/auth/login
    ↓
✅ Backend responde: {token: "..."}
```

---

## 📊 Estado de Componentes

### ANTES (Actual)
| Componente | Estado | Problema |
|------------|--------|----------|
| Frontend Vercel | ✅ Corriendo | ❌ No sabe dónde está el API |
| Backend Railway | ✅ Corriendo | ✅ Esperando requests |
| CORS | ✅ Configurado | ✅ Listo para aceptar |
| VITE_API_URL | ❌ NO EXISTE | 🔴 Frontend ciego |

### DESPUÉS (Objetivo)
| Componente | Estado | Problema |
|------------|--------|----------|
| Frontend Vercel | ✅ Corriendo | ✅ Sabe dónde está el API |
| Backend Railway | ✅ Corriendo | ✅ Recibe requests |
| CORS | ✅ Configurado | ✅ Acepta requests |
| VITE_API_URL | ✅ EXISTE | ✅ Frontend conectado |

---

## 🧪 Cómo Verificar

### Test 1: Frontend Carga?
```
Abre: https://mara-frontend-production.up.railway.app
Esperado: ✅ Página de login carga
```

### Test 2: Backend Responde?
```
Abre: https://mara-production-7e59.up.railway.app/api/health
Esperado: ✅ JSON {"ok":true}
```

### Test 3: Frontend Conecta?
```
1. Abre login page
2. DevTools → Network
3. Intenta loguear
4. Busca un request a /api/auth/login
5. URL debe ser: https://mara-production-7e59.up.railway.app/api/...
   (NO https://mara-frontend-production.up.railway.app/api/...)
```

---

## 🎯 Resumen

```
Problema:  Frontend no sabe dónde está el Backend
Causa:     Variable VITE_API_URL no existe en Vercel
Solución:  Añadirla a Vercel con el valor correcto
Tiempo:    2 minutos
Resultado: ✅ Todo funciona
```

---

**¿Claro? Ve a [`ACCION_INMEDIATA.md`](ACCION_INMEDIATA.md) y sigue los 5 pasos.** ✅
