import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Load user on refresh
  useEffect(() => {
  let mounted = true;

  const token = localStorage.getItem("token");
  if (!token) {
    setLoading(false);
    return;
  }

  api
    .get("/auth/me")
    .then((res) => {
      if (mounted) setUser(res.data);
    })
    .catch(() => {
      localStorage.removeItem("token");
      if (mounted) setUser(null);
    })
    .finally(() => {
      if (mounted) setLoading(false);
    });

  return () => {
    mounted = false;
  };
}, []);


  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
