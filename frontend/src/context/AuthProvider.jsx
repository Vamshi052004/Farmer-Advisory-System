import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);

      if (!decoded?.exp || decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return;
      }

      setUser(decoded);
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);

    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
    } catch {
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}