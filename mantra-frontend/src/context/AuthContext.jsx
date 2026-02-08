import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authAPI } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("mantra_user") || "null")
  );
  const [loading, setLoading] = useState(true);

  // Check session on mount — always sync user from API
  useEffect(() => {
    const session = localStorage.getItem("mantra_session");
    if (session) {
      authAPI.getMe()
        .then(({ data }) => {
          setUser(data);
          localStorage.setItem("mantra_user", JSON.stringify(data));
        })
        .catch(() => {
          localStorage.removeItem("mantra_session");
          localStorage.removeItem("mantra_user");
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    localStorage.setItem("mantra_session", JSON.stringify(data.session));
    localStorage.setItem("mantra_user", JSON.stringify(data.user));
    setUser(data.user);
    return data;
  }, []);

  const register = useCallback(async ({ email, password, username, displayName }) => {
    const { data } = await authAPI.register({ email, password, username, displayName });
    localStorage.setItem("mantra_session", JSON.stringify(data.session));
    localStorage.setItem("mantra_user", JSON.stringify(data.user));
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(async () => {
    try { await authAPI.logout(); } catch {}
    localStorage.removeItem("mantra_session");
    localStorage.removeItem("mantra_user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
