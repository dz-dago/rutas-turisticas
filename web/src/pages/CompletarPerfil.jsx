import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import BotonRegresar from "../components/BotonRegresar";

function CompletarPerfil() {
  const navigate = useNavigate();
  const { setUsuario } = useAuth();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    rol: "turista",
    telefono: "",
    nacionalidad: "Guatemala",
    perfilTipo: "TUR",

    avatar: "",
    documentoIdentidad: "",
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

  const subirImagen = async (archivo) => {
    try {
      const formData = new FormData();
      formData.append("imagen", archivo);

      const res = await api.post("/upload/imagen", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      return res.data.url;
    } catch (error) {
      toast.error("Error al subir imagen");
      return "";
    }
  };

  const completarPerfil = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const loadingToast = toast.loading("Guardando perfil...");

      const payload = {
        ...form,
        idiomas: form.idiomas
          ? form.idiomas.split(",").map((i) => i.trim())
          : [],
        rutasOfrecidas: form.rutasOfrecidas
          ? form.rutasOfrecidas.split(",").map((r) => r.trim())
          : [],
        precioPromedio: Number(form.precioPromedio) || 0
      };

      const res = await api.post("/auth/completar-perfil", payload);

      toast.dismiss(loadingToast);
      toast.success("Perfil completado correctamente");

      setUsuario(res.data.usuario);

      const rol = res.data.usuario.rol;

      if (rol === "propietario") {
        navigate("/propietario");
      } else if (rol === "guia") {
        navigate("/guia");
      } else {
        navigate("/turista");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.mensaje ||
        "Error al completar perfil"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8">

        <BotonRegresar />

        <h1 className="text-4xl font-black">
          Completar perfil
        </h1>

        <p className="text-zinc-400 mt-3">
          Completa la información necesaria para continuar.
        </p>

        <form onSubmit={completarPerfil} className="space-y-5 mt-8">

          <div>
            <label className="block mb-2 text-zinc-300">
              Foto de perfil
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const archivo = e.target.files[0];
                if (!archivo) return;

                const loadingToast = toast.loading("Subiendo imagen...");

                const url = await subirImagen(archivo);

                toast.dismiss(loadingToast);

                if (url) {
                  setForm({
                    ...form,
                    avatar: url
                  });

                  toast.success("Imagen subida");
                }
              }}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4"
            />

            {form.avatar && (
              <img
                src={form.avatar}
                alt="avatar"
                className="w-24 h-24 rounded-full object-cover mt-4"
              />
            )}
          </div>

          <select
            name="rol"
            value={form.rol}
            onChange={handleChange}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4"
          >
            <option value="turista">Turista</option>
            <option value="guia">Guía turístico</option>
            <option value="propietario">Propietario</option>
          </select>

          {form.rol === "turista" && (
            <select
              name="perfilTipo"
              value={form.perfilTipo}
              onChange={handleChange}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4"
            >
              <option value="TUR">
                Turista general
              </option>

              <option value="FAM">
                Familia
              </option>

              <option value="PAR">
                Pareja
              </option>

              <option value="SOL">
                Solo
              </option>

              <option value="GRP">
                Grupo
              </option>
            </select>
          )}

          {form.rol === "guia" && (
            <div className="space-y-5">

              <input
                type="text"
                name="telefono"
                placeholder="Número de teléfono"
                value={form.telefono}
                onChange={handleChange}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4"
              />

              <input
                type="text"
                name="idiomas"
                placeholder="Idiomas separados por coma"
                value={form.idiomas}
                onChange={handleChange}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4"
              />

              <input
                type="text"
                name="experiencia"
                placeholder="Experiencia"
                value={form.experiencia}
                onChange={handleChange}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4"
              />

              <textarea
                name="descripcion"
                placeholder="Descripción profesional"
                value={form.descripcion}
                onChange={handleChange}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 min-h-[120px]"
              />

              <div>
                <label className="block mb-2 text-zinc-300">
                  Credencial de identificación
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const archivo = e.target.files[0];
                    if (!archivo) return;

                    const loadingToast = toast.loading("Subiendo credencial...");

                    const url = await subirImagen(archivo);

                    toast.dismiss(loadingToast);

                    if (url) {
                      setForm({
                        ...form,
                        credencialIdentificacion: url
                      });

                      toast.success("Credencial subida");
                    }
                  }}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4"
                />

                {form.credencialIdentificacion && (
                  <img
                    src={form.credencialIdentificacion}
                    alt="Credencial"
                    className="w-full max-h-56 rounded-2xl object-cover mt-4"
                  />
                )}
              </div>

              <input
                type="text"
                name="rutasOfrecidas"
                placeholder="Rutas ofrecidas separadas por coma"
                value={form.rutasOfrecidas}
                onChange={handleChange}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4"
              />

              <input
                type="number"
                name="precioPromedio"
                placeholder="Precio promedio"
                value={form.precioPromedio}
                onChange={handleChange}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4"
              />

            </div>
          )}

          {form.rol === "propietario" && (
            <div className="space-y-5">
              <input
                type="text"
                name="telefono"
                placeholder="Número de teléfono"
                value={form.telefono}
                onChange={handleChange}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4"
              />

              <div>
                <label className="block mb-2 text-zinc-300">
                  Documento de identificación
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const archivo = e.target.files[0];
                    if (!archivo) return;

                    const url = await subirImagen(archivo);

                    if (url) {
                      setForm({
                        ...form,
                        documentoIdentidad: url
                      });
                    }
                  }}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 py-4 rounded-2xl font-bold transition"
          >
            {loading ? "Guardando..." : "Guardar perfil"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default CompletarPerfil;
