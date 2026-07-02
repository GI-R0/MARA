import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "/api";
const API = axios.create({
  baseURL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach(({ reject }) => reject(error));
  failedQueue = [];
};

const refreshAccessToken = async () => {
  try {
    const response = await axios.post(
      `${baseURL}/auth/refresh`,
      {},
      { withCredentials: true }
    );
    const { token } = response.data;
    if (token) {
      localStorage.setItem("token", token);
    }
    return token;
  } catch (error) {
    localStorage.removeItem("token");
    delete API.defaults.headers.common["Authorization"];
    window.location.href = "/login";
    return null;
  }
};

// Interceptor de request: agregar token en header
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de response: manejar 401 y refrescar token
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return API(originalRequest);
          })
          .catch(() => Promise.reject(error));
      }

      isRefreshing = true;
      originalRequest._retry = true;

      try {
        const newToken = await refreshAccessToken();
        if (newToken) {
          API.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
          failedQueue.forEach(({ resolve }) => resolve(newToken));
          failedQueue = [];
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return API(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    } else if (error.response?.status === 403) {
      console.warn("Acceso denegado (403):", error.response.data?.msg);
    }

    return Promise.reject(error);
  }
);

export default API;