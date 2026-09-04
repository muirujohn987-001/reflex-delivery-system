import { createContext, useContext, useState, useCallback } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async ({ identifier, password }) => {
    setLoading(true);

    try {
      const data = await api.login({
        email: identifier,
        password,
      });

      const token = data?.data?.token || data?.token;
      const loggedInUser = data?.data?.user || data?.user;

      if (!token || !loggedInUser) {
        throw new Error("Invalid login response from server");
      }

      localStorage.setItem("reflex_token", token);
      localStorage.setItem("reflex_user", JSON.stringify(loggedInUser));

      setUser(loggedInUser);

      return loggedInUser;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (registerData) => {
    setLoading(true);

    try {
      const data = await api.register({
        name: registerData.fullName,
        email: registerData.email,
        phone: registerData.phone,
        password: registerData.password,
        role: registerData.role,
      });

      const createdUser = data?.data?.user || data?.user;

      if (!createdUser) {
        throw new Error("Invalid registration response from server");
      }

      return createdUser;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("reflex_token");
    localStorage.removeItem("reflex_user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }

  return ctx;
}
