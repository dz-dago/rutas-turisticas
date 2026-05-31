import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, roles }) {
  const { usuario, cargando } = useAuth();

  if (cargando) {
    return <p>Cargando...</p>;
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  // Si se especifican roles permitidos y el usuario no tiene uno, redirigir
  if (roles && roles.length > 0 && !roles.includes(usuario.rol)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;