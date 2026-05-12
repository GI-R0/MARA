import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
});

API.interceptors.request.use((req) => {
  // Token se envía automáticamente en cookies HttpOnly
  return req;
});

API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      // Token HttpOnly expirado, redirigir a login
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    } else if (error.response?.status === 403) {
      console.warn("Acceso denegado (403):", error.response.data.msg);
    }
    return Promise.reject(error);
  },
);

export default API;
