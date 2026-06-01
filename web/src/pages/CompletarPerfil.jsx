import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

function CompletarPerfil() {
  const navigate = useNavigate();
  const { setUsuario } = useAuth();

  const [form, setForm] = useState({
    rol: "turista",
    telefono: "",
    nacionalidad: "Guatemala",
    perfilTipo: "NAC",

    fotoPerfil: "",
    credencialIdentificacion: "",

    idiomas: "",
    descripcion: "",
    experiencia: "",
    rutasOfrecidas: "",
    precioPromedio: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const completarPerfil = async (e) => {
    e.preventDefault();

    const res = await api.post("/auth/completar-perfil", {
      ...form,
      idiomas: form.idiomas
        ? form.idiomas.split(",").map(i => i.trim())
        : [],

      rutasOfrecidas: form.rutasOfrecidas
        ? form.rutasOfrecidas.split(",").map(r => r.trim())
        : [],

      precioPromedio: Number(form.precioPromedio) || 0
    });

    setUsuario(res.data.usuario);
    navigate(`/${res.data.usuario.rol}`);
  };

  return (
    <div>
      <h1>Completar perfil</h1>

      <form onSubmit={completarPerfil}>
        <label>Tipo de usuario</label>
        <select name="rol" value={form.rol} onChange={handleChange}>
          <option value="turista">Turista</option>
          <option value="guia">Guía turístico</option>
          <option value="local">Local / Negocio</option>
        </select>

        <br />

        <label>Teléfono</label>
        <input
          type="text"
          name="telefono"
          value={form.telefono}
          onChange={handleChange}
          required
        />

        <br />

        <label>Nacionalidad</label>
        <input
          type="text"
          name="nacionalidad"
          value={form.nacionalidad}
          onChange={handleChange}
        />

        <br />

        <label>Tipo de perfil</label>
        <select
          name="perfilTipo"
          value={form.perfilTipo}
          onChange={handleChange}
          className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700"
        >
          <option value="">Seleccione una opción</option>
          <option value="LOC">Local</option>
          <option value="NAC">Turista nacional</option>
          <option value="INT">Turista internacional</option>
        </select>

        <br />

        <button type="submit">Guardar perfil</button>
      </form>
    </div>
  );
}

export default CompletarPerfil;