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
    } catch {
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

  const login = async (email, password) => {
    const res = await API.post("/auth/login", { email, password });
    setAuthToken(res.data.token);
    setUser(res.data.user);
  };

  const register = async (name, email, password) => {
    const res = await API.post("/auth/register", { name, email, password });
    setAuthToken(res.data.token);
    setUser(res.data.user);
  };

  const logout = () => {
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
