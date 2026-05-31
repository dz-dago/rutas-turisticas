import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  const obtenerPerfil = async () => {
    try {
      const res = await api.get("/auth/perfil");
      setUsuario(res.data);
      return res.data;
    } catch (error) {
      localStorage.removeItem("token");
      setUsuario(null);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      obtenerPerfil();
    } else {
      setCargando(false);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUsuario(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ usuario, setUsuario, cargando, obtenerPerfil, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);