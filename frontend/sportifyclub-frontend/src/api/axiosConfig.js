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

const refreshAuthToken = async () => {
  return axios.post(
    `${baseURL}/auth/refresh`,
    {},
    { withCredentials: true },
  );
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

    if (status === 401 && originalRequest && !originalRequest._retry) {
      if (isAuthRequest) {
        return Promise.reject(error);
      }

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
            failedQueue.forEach(({ resolve: queuedResolve }) => queuedResolve());
            failedQueue = [];
            resolve(API(originalRequest));
          })
          .catch((refreshError) => {
            processQueue(refreshError);
            if (window.location.pathname !== "/login") {
              window.location.href = "/login";
            }
            reject(refreshError);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    if (status === 401 && !isAuthRequest) {
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    } else if (status === 403) {
      console.warn("Acceso denegado (403):", error.response.data.msg);
    }

    return Promise.reject(error);
  },
);

export default API;
