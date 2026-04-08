import { useEffect, useState } from "react";
import api from "../api/axios";
import { AuthContext } from "./auth-context";
import idbStorage from "../utils/idbStorage";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() =>
    Boolean(localStorage.getItem("token"))
  );

  useEffect(() => {
    let mounted = true;
    const token = localStorage.getItem("token");

    // Hydrate user from IndexedDB cache immediately
    idbStorage.getItem("cached-user").then((cached) => {
      if (mounted && cached && token) {
        setUser(cached);
        setLoading(false);
      }
    });

    if (!token) {
      return () => {
        mounted = false;
      };
    }

    api
      .get("/auth/me")
      .then((res) => {
        if (mounted) {
          setUser(res.data);
          idbStorage.setItem("cached-user", res.data);
        }
      })
      .catch((err) => {
        // Only logout if the server says the token is invalid (401)
        // This prevents logging out when the internet is just down.
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          idbStorage.removeItem("cached-user");
          if (mounted) {
            setUser(null);
          }
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    idbStorage.removeItem("cached-user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
