# 📦 Configuración de Despliegue - SportifyClub

> Documentación completa para que tu despliegue en Vercel y Railway funcione correctamente.

---

## 🚨 TU DESPLIEGUE ESTÁ ROTO - ACCIÓN INMEDIATA

**LEER PRIMERO:** [`ACCION_INMEDIATA.md`](ACCION_INMEDIATA.md)

---

## 📋 Archivos en esta carpeta

### 1. [`ACCION_INMEDIATA.md`](ACCION_INMEDIATA.md) ⭐ **EMPIEZA AQUÍ**
   - **2 minutos de trabajo**
   - Instrucciones paso a paso para Vercel
   - Soluciona: login y registro no funcionan

### 2. [`VERCEL_ENVIRONMENT_SETUP.md`](VERCEL_ENVIRONMENT_SETUP.md)
   - Guía completa para Vercel
   - Qué hacer si no funciona con los pasos básicos
   - Verificación técnica

### 3. [`RAILWAY_ENVIRONMENT_SETUP.md`](RAILWAY_ENVIRONMENT_SETUP.md)
   - Guía completa para Railway (backend)
   - Variables de entorno requeridas
   - Checklist de verificación

---

## 🔍 ¿Qué salió mal?

Tu **frontend en Vercel** intenta conectar a una URL local (`/api`) en lugar de tu backend en Railway (`https://mara-production-7e59.up.railway.app/api`).

**Causa:** Falta la variable de entorno `VITE_API_URL` en Vercel.

---

## ✅ Checklist Rápido

- [ ] Variable `VITE_API_URL` añadida en Vercel
- [ ] Vercel ha redeplegado (✅ Ready)
- [ ] Backend en Railway responde a `/api/health`
- [ ] Login funciona: https://mara-frontend-production.up.railway.app/login
- [ ] Registro funciona: https://mara-frontend-production.up.railway.app/register

---

## 🧪 Test Final

Una vez que todo esté configurado:

```bash
# Backend está levantado?
curl https://mara-production-7e59.up.railway.app/api/health

# Frontend carga?
https://mara-frontend-production.up.railway.app

# Puedo loguear?
Email: admin@sportify.com
Password: Admin123!
```

Todos deberían funcionar ✅

---

## 📚 Estructura de URLs

### Desarrollo Local
```
Frontend:  http://localhost:5173
Backend:   http://localhost:4000
API usado: http://localhost:4000/api (con proxy)
```

### Producción
```
Frontend:  https://mara-frontend-production.up.railway.app
Backend:   https://mara-production-7e59.up.railway.app
API usado: https://mara-production-7e59.up.railway.app/api
```

---

## 🆘 Troubleshooting

### "Login aún no funciona"
1. ¿Esperaste a que Vercel redeploy? (busca ✅ Ready en Deployments)
2. ¿El backend está levantado? (test `/api/health`)
3. ¿Es la variable exacta? Revisa: `VITE_API_URL = https://mara-production-7e59.up.railway.app/api`

### "Backend da error"
1. Ve a Railway Dashboard
2. Click en tu proyecto
3. Busca los logs
4. Verifica que MongoDB está conectado

### "Veo placeholders raros en formularios"
- Esto es un problema visual menor (ya revisado)
- Se soluciona si esperas a que Vercel termine el redeploy
- Si persiste, leer: [`VERCEL_ENVIRONMENT_SETUP.md`](VERCEL_ENVIRONMENT_SETUP.md)

---

## 📞 Resumen de Variables

### Vercel (Frontend)
```
VITE_API_URL = https://mara-production-7e59.up.railway.app/api
```

### Railway (Backend)
```
CORS_ORIGIN = https://mara-frontend-production.up.railway.app
NODE_ENV = production
MONGODB_URI = [tu mongo uri]
JWT_SECRET = [tu secret]
```

---

**¿Listo? Empieza por [`ACCION_INMEDIATA.md`](ACCION_INMEDIATA.md) y luego confirma cuando todo funcione.** ✅
