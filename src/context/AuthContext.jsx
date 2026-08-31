import { createContext, useContext, useState, useCallback } from "react";
import { mockUsers } from "../utils/mockData";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Simulated authentication — swap for a real API call later.
  const login = useCallback(({ role }) => {
    setLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const matched = mockUsers.find((u) => u.role === role) || mockUsers[0];
        setUser(matched);
        setLoading(false);
        resolve(matched);
      }, 600);
    });
  }, []);

  const register = useCallback(({ fullName, role }) => {
    setLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser = { id: `u_${Date.now()}`, name: fullName, role };
        setUser(newUser);
        setLoading(false);
        resolve(newUser);
      }, 600);
    });
  }, []);

  const logout = useCallback(() => setUser(null), []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}
