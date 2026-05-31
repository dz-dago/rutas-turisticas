import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AuthSuccess() {
  const navigate = useNavigate();
  const { obtenerPerfil } = useAuth();

  useEffect(() => {
    const procesarLogin = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (!token) {
        navigate("/login");
        return;
      }

      localStorage.setItem("token", token);

      const perfil = await obtenerPerfil();

      if (perfil?.perfilCompleto) {
        navigate(`/${perfil.rol}`);
      } else {
        navigate("/completar-perfil");
      }
    };

    procesarLogin();
  }, []);

  return <p>Procesando inicio de sesión...</p>;
}

export default AuthSuccess;