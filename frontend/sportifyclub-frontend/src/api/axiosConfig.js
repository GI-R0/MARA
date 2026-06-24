import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "/api";
const API = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 10000,
});

let isRefreshing = false;
let failedQueue = [];
let logoutCallback = null;

export const registerLogoutCallback = (callback) => {
  logoutCallback = callback;
};

const processQueue = (error) => {
  failedQueue.forEach(({ reject }) => reject(error));
  failedQueue = [];
};

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
            failedQueue.forEach(({ resolve: queuedResolve }) =>
              queuedResolve(),
            );
            failedQueue = [];
            resolve(API(originalRequest));
          })
          .catch((refreshError) => {
            processQueue(refreshError);

            if (logoutCallback && typeof logoutCallback === "function") {
              logoutCallback();
            } else {
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

    if (status === 401 && !isAuthRequest && !originalRequest._retry) {
      if (logoutCallback && typeof logoutCallback === "function") {
        logoutCallback();
      } else if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    if (status === 403) {
      console.warn("Acceso denegado (403):", error.response?.data?.msg);
    }

    return Promise.reject(error);
  },
);

export default API;
