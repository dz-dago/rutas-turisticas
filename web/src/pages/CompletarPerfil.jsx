import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

function CompletarPerfil() {
  const navigate = useNavigate();
  const { setUsuario } = useAuth();

  const [rol, setRol] = useState("turista");
  const [telefono, setTelefono] = useState("");
  const [nacionalidad, setNacionalidad] = useState("Guatemala");
  const [perfilTipo, setPerfilTipo] = useState("TUR");

  const completarPerfil = async (e) => {
    e.preventDefault();

    const res = await api.post("/auth/completar-perfil", {
      rol,
      telefono,
      nacionalidad,
      perfilTipo
    });

    setUsuario(res.data.usuario);
    navigate(`/${res.data.usuario.rol}`);
  };

  return (
    <div>
      <h1>Completar perfil</h1>

      <form onSubmit={completarPerfil}>
        <label>Tipo de usuario</label>
        <select value={rol} onChange={(e) => setRol(e.target.value)}>
          <option value="turista">Turista</option>
          <option value="guia">Guía turístico</option>
          <option value="local">Local / Negocio</option>
        </select>

        <br />

        <label>Teléfono</label>
        <input
          type="text"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          required
        />

        <br />

        <label>Nacionalidad</label>
        <input
          type="text"
          value={nacionalidad}
          onChange={(e) => setNacionalidad(e.target.value)}
        />

        <br />

        <label>Tipo de perfil</label>
        <select value={perfilTipo} onChange={(e) => setPerfilTipo(e.target.value)}>
          <option value="FAM">Familia</option>
          <option value="PAR">Pareja</option>
          <option value="SOL">Solo</option>
          <option value="GRP">Grupo</option>
          <option value="LOC">Local</option>
          <option value="TUR">Turista / Internacional</option>
        </select>

        <br />

        <button type="submit">Guardar perfil</button>
      </form>
    </div>
  );
}

export default CompletarPerfil;