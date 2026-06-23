# Corrección del Sistema de Autenticación - Eliminación de Logouts Accidentales

## Problema Identificado

El sistema de autenticación tenía una desincronización crítica entre el interceptor de Axios y el contexto de autenticación de React:

- El interceptor redirigía directamente a `/login` cuando ocurría un 401
- No notificaba al `AuthContext` para actualizar el estado de usuario
- Esto causaba logouts accidentales e inconsistencia de estado

## Cambios Realizados

### 1. **archivo: `src/api/axiosConfig.js`**

#### Mejoras de Robustez:

1. **Timeout mejorado**: 
   - Se agregó timeout general de 10 segundos al cliente Axios
   - Timeout de 5 segundos específico para requests de refresh de token
   - Previene bloqueos indefinidos

2. **Sistema de Callback para Logout**:
   ```javascript
   let logoutCallback = null;
   
   export const registerLogoutCallback = (callback) => {
     logoutCallback = callback;
   };
   ```
   - Permite que el interceptor notifique al contexto sin dependencias circulares
   - Se registra desde `AuthProvider` al montar

3. **Mejor Sincronización en Refresh de Token**:
   - Cuando el refresh falla, se llama `logoutCallback()` en lugar de redirigir directamente
   - El callback ejecuta `setUser(null)` en el contexto de React
   - Si no hay callback registrado, existe un fallback a redirección (para casos edge)

4. **Manejo Mejorado de 401**:
   - Línea 114-120: Después de fallar el refresh, se verifica nuevamente si hay 401
   - Se usa el callback de logout del contexto si está disponible
   - Solo como último recurso se redirige manualmente

5. **Documentación Mejorada**:
   - Se agregaron comentarios explicativos en funciones críticas
   - Mejor claridad sobre qué hace cada sección del interceptor

#### Cambios Específicos de Código:

```javascript
// ANTES: Redirección directa sin sincronización
if (window.location.pathname !== "/login") {
  window.location.href = "/login";  // ❌ No actualiza estado de React
}

// DESPUÉS: Sincronización con contexto
if (logoutCallback && typeof logoutCallback === "function") {
  logoutCallback();  // ✅ Actualiza estado correctamente
} else {
  // Fallback si no hay callback registrado
  console.warn("Logout callback not registered, falling back to redirect");
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}
```

---

### 2. **archivo: `src/context/AuthContext.jsx`**

#### Cambios Principales:

1. **Importar función de Registro**:
   ```javascript
   import API, { registerLogoutCallback } from "../api/axiosConfig";
   ```

2. **Nueva Función de Logout Sincronizado**:
   ```javascript
   const handleInterceptorLogout = () => {
     setUser(null);  // Actualiza estado de React directamente
   };
   ```
   - Se ejecuta cuando el interceptor detecta fallo de refresh
   - Evita race conditions al actualizar el estado de usuario

3. **Registro del Callback en useEffect**:
   ```javascript
   useEffect(() => {
     registerLogoutCallback(handleInterceptorLogout);
     loadUser();  // Cargar usuario inicial
   }, []);
   ```
   - Se ejecuta una sola vez al montar `AuthProvider`
   - Registra la función de logout con el interceptor
   - Carga los datos del usuario logueado

4. **Exposición en el Context**:
   ```javascript
   value={{
     user,
     login,
     register,
     logout,
     loading,
     loadUser,
     handleInterceptorLogout,  // Ahora disponible si se necesita
   }}
   ```

---

## Flujo de Autenticación Mejorado

```
Petición con Token Expirado (401)
    ↓
Interceptor detecta 401
    ↓
¿Primer intento? Sí → Intentar refresh del token
    ↓
¿Refresh exitoso? 
    ├─ Sí → Procesar cola de peticiones pendientes
    │       → Reintentar petición original
    │       → ✅ Continuamos sin logout
    │
    └─ No → Llamar logoutCallback()
            → handleInterceptorLogout() ejecuta setUser(null)
            → ✅ Estado de React se sincroniza correctamente
            → Redirigir a /login

¿Hay múltiples peticiones en paralelo?
    → Se encolan en failedQueue hasta que refresh termine
    → Evita race conditions
```

---

## Beneficios de los Cambios

| Problema | Solución | Beneficio |
|----------|----------|-----------|
| Redirección sin sincronización | Callback al contexto | El estado de React se actualiza correctamente |
| Race conditions en refresh | Cola de peticiones | Las peticiones se procesan ordenadamente |
| Bloqueos indefinidos | Timeout agregado | Los errores se manejan rápidamente |
| Inconsistencia de estado | handleInterceptorLogout | Un único punto de logout desde interceptor |
| Sin fallback | Redirección como fallback | Funciona incluso sin callback |

---

## Testing Recomendado

Para validar los cambios:

1. **Logout Manual**: 
   - Verificar que el logout desde UI funciona correctamente
   - Confirmar que `user` se limpia en el contexto

2. **Token Expirado**:
   - Esperar a que expire el token (o modificar en dev tools)
   - Realizar una petición
   - Verificar que se redirige a /login sin errores de console

3. **Múltiples Peticiones Paralelas**:
   - Hacer varias peticiones simultáneamente con token expirado
   - Confirmar que la cola maneja todas correctamente

4. **Refresh Fallido**:
   - Configurar un fallo en /auth/refresh
   - Verificar que el logout se ejecuta y el estado se limpia

---

## Notas Técnicas

- El callback se registra en el `useEffect` del `AuthProvider`
- Está disponible globalmente para el interceptor (variable en closure)
- No hay riesgo de ref circular porque se registra después de que axios está inicializado
- El fallback a redirección garantiza que funciona incluso sin el callback
