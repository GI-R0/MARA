import axios from "axios";
import toast from "react-hot-toast";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
});

API.interceptors.request.use((req) => {
  return req;
});

API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      if (window.location.pathname !== "/login") {
        toast.error("Tu sesión ha expirado");
        window.location.href = "/login";
      }
    } else if (error.response?.status === 403) {
      toast.error(error.response.data.msg || "Acceso denegado");
    } else if (error.response?.status >= 500) {
      toast.error("Error del servidor. Por favor, intenta más tarde.");
    }
    return Promise.reject(error);
  },
);

export default API;
