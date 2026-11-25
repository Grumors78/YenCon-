import { createContext, useContext, useEffect, useState } from "react";
import { api, getToken, setToken } from "../api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => !!getToken());

  // Restore the session on page load.
  useEffect(() => {
    if (!getToken()) return;
    api("/auth/me")
      .then((d) => setUser(d.user))
      .catch((e) => { if (e.status === 401 || e.status === 403) setToken(null); })
      .finally(() => setLoading(false));
  }, []);

  const finish = (d) => { setToken(d.token); setUser(d.user); return d.user; };

  const value = {
    user,
    loading,
    login: async (login, password) => finish(await api("/auth/login", { method: "POST", body: { login, password } })),
    signup: async (fields) => finish(await api("/auth/signup", { method: "POST", body: fields })),
    changePassword: async (currentPassword, newPassword) =>
      finish(await api("/auth/change-password", { method: "POST", body: { currentPassword, newPassword } })),
    logout: () => { setToken(null); setUser(null); },
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
