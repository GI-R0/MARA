import { createContext, useState, useEffect } from "react";
import API, { registerLogoutCallback } from "../api/axiosConfig";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      const res = await API.get("/auth/me");
      setUser(res.data);
    } catch {
      setUser((prev) => (prev ? prev : null));
    } finally {
      setLoading(false);
    }
  };

  const handleInterceptorLogout = () => {
    setUser(null);
  };

  useEffect(() => {
    registerLogoutCallback(handleInterceptorLogout);
    loadUser();
  }, []);

  const login = async (email, password) => {
    const res = await API.post("/auth/login", { email, password });
    setUser(res.data.user);
    return res;
  };

  const register = async (name, email, password) => {
    const res = await API.post("/auth/register", { name, email, password });
    setUser(res.data.user);
    return res;
  };

  const logout = async () => {
    try {
      await API.post("/auth/logout");
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
        loadUser,
        handleInterceptorLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
