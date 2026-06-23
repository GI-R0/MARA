import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "/api";
const API = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 10000, // 10 segundos de timeout
});

let isRefreshing = false;
let failedQueue = [];
let logoutCallback = null;

/**
 * Registra un callback de logout que será llamado desde el interceptor
 * cuando el refresh de token falle
 */
export const registerLogoutCallback = (callback) => {
  logoutCallback = callback;
};

/**
 * Procesa la cola de peticiones fallidas durante el refresh
 */
const processQueue = (error) => {
  failedQueue.forEach(({ reject }) => reject(error));
  failedQueue = [];
};

/**
 * Intenta refrescar el token de autenticación
 */
const refreshAuthToken = async () => {
  try {
    return await axios.post(
      `${baseURL}/auth/refresh`,
      {},
      { withCredentials: true, timeout: 5000 },
    );
  } catch (error) {
    throw new Error("Token refresh failed");
  }
};

API.interceptors.request.use((req) => {
  // El token de acceso se envía automáticamente en cookies HttpOnly
  return req;
});

API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const requestUrl = originalRequest?.url || "";

    const isAuthRequest = requestUrl.startsWith("/auth/");

    // Manejo de 401 Unauthorized
    if (status === 401 && originalRequest && !originalRequest._retry) {
      // No intentar refresh en endpoints de autenticación
      if (isAuthRequest) {
        return Promise.reject(error);
      }

      // Si ya estamos refrescando, encolar esta petición
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => API(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise((resolve, reject) => {
        refreshAuthToken()
          .then(() => {
            // Token refrescado exitosamente, procesar cola de espera
            failedQueue.forEach(({ resolve: queuedResolve }) =>
              queuedResolve(),
            );
            failedQueue = [];
            resolve(API(originalRequest));
          })
          .catch((refreshError) => {
            // El refresh falló - logout a través del contexto
            processQueue(refreshError);

            // Llamar al callback de logout si está registrado
            if (logoutCallback && typeof logoutCallback === "function") {
              logoutCallback();
            } else {
              // Fallback: redirigir a login si no hay callback
              console.warn(
                "Logout callback not registered, falling back to redirect",
              );
              if (window.location.pathname !== "/login") {
                window.location.href = "/login";
              }
            }

            reject(refreshError);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    // Manejo adicional de 401 después de fallar el refresh
    if (status === 401 && !isAuthRequest && !originalRequest._retry) {
      if (logoutCallback && typeof logoutCallback === "function") {
        logoutCallback();
      } else if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    // Manejo de 403 Forbidden
    if (status === 403) {
      console.warn("Acceso denegado (403):", error.response?.data?.msg);
    }

    return Promise.reject(error);
  },
);

export default API;
