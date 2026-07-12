import { createContext, useState, useEffect } from "react";
import API from "../api/axiosConfig";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const res = await API.get("/auth/me");
      setUser(res.data);
    } catch (error) {
      console.error("Error loading user:", error.message);
      localStorage.removeItem("token");
      delete API.defaults.headers.common["Authorization"];
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const setAuthToken = (token) => {
    if (token) {
      localStorage.setItem("token", token);
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  };

  const ensureNoActiveSession = async () => {
    if (user) {
      throw new Error(
        "Ya hay una sesion activa. Cierra sesion antes de iniciar o crear otra cuenta.",
      );
    }

    const existingToken = localStorage.getItem("token");
    if (!existingToken) {
      return;
    }

    try {
      API.defaults.headers.common["Authorization"] = `Bearer ${existingToken}`;
      const res = await API.get("/auth/me");
      if (res.data) {
        setUser(res.data);
        throw new Error(
          "Ya hay una sesion activa. Cierra sesion antes de iniciar o crear otra cuenta.",
        );
      }
    } catch (error) {
      if (error.message?.includes("Ya hay una sesion activa")) {
        throw error;
      }

      localStorage.removeItem("token");
      delete API.defaults.headers.common["Authorization"];
      setUser(null);
    }
  };

  const login = async (email, password) => {
    await ensureNoActiveSession();

    const res = await API.post("/auth/login", { email, password });
    if (res.data.token) {
      setAuthToken(res.data.token);
    }
    setUser(res.data.user);
    return res.data;
  };

  const register = async (name, email, password) => {
    await ensureNoActiveSession();

    const res = await API.post("/auth/register", { name, email, password });
    if (res.data.token) {
      setAuthToken(res.data.token);
    }
    setUser(res.data.user);
    return res.data;
  };

  const logout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
    localStorage.removeItem("token");
    delete API.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, loading, loadUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};