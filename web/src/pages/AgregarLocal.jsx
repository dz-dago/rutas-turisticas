import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import api from "../api/api";
import DashboardLayout from "../components/DashboardLayout";

const categorias = [
  { value: "CAF", label: "Cafeterías y postres" },
  { value: "CUL", label: "Turismo y cultura" },
  { value: "EXP", label: "Experiencias y relax" },
  { value: "GAS", label: "Gastronomía" },
  { value: "ENT", label: "Entretenimiento y eventos" },
  { value: "NAT", label: "Parques y naturaleza" },
  { value: "HIS", label: "Historia" },
  { value: "REL", label: "Religioso" }
];

function AgregarLocal() {
  const navigate = useNavigate();

  const [guardando, setGuardando] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    categoria: "GAS",
    descripcion: "",
    direccion: "",
    lat: "",
    lng: "",
    precioPromedio: "",
    foto: ""
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

  const usarUbicacionActual = () => {
    if (!navigator.geolocation) {
      toast.error("Tu navegador no permite obtener ubicación");
      return;
    }

    const loadingToast = toast.loading("Obteniendo ubicación...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        toast.dismiss(loadingToast);

        setForm({
          ...form,
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });

        toast.success("Ubicación detectada");
      },
      () => {
        toast.dismiss(loadingToast);
        toast.error("No se pudo obtener la ubicación");
      }
    );
  };

  const crearLocal = async (e) => {
    e.preventDefault();

    try {
      setGuardando(true);

      const loadingToast = toast.loading("Guardando local...");

      await api.post("/locales/mis-locales", {
        nombre: form.nombre,
        categoria: form.categoria,
        descripcion: form.descripcion,
        ubicacion: {
          lat: Number(form.lat),
          lng: Number(form.lng),
          direccion: form.direccion
        },
        fotos: form.foto ? [form.foto] : [],
        precioPromedio: Number(form.precioPromedio) || 0,
        horario: {
          lunes: "08:00 - 20:00",
          martes: "08:00 - 20:00",
          miercoles: "08:00 - 20:00",
          jueves: "08:00 - 20:00",
          viernes: "08:00 - 20:00",
          sabado: "08:00 - 18:00",
          domingo: "cerrado"
        }
      });

      toast.dismiss(loadingToast);
      toast.success("Local creado correctamente");

      navigate("/propietario/locales");
    } catch (error) {
      toast.error(
        error.response?.data?.mensaje ||
        "Error al crear local"
      );
    } finally {
      setGuardando(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-zinc-950 text-white px-5 md:px-8 py-10">
        <h1 className="text-4xl font-black">
          Agregar local
        </h1>

        <p className="text-zinc-400 mt-3 max-w-3xl">
          Registra tu local. Se guardará como pendiente y será visible en la plataforma cuando tenga suscripción activa.
        </p>

        <form
          onSubmit={crearLocal}
          className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 mt-10 max-w-4xl space-y-6"
        >
          <input
            type="text"
            name="nombre"
            placeholder="Nombre del local"
            value={form.nombre}
            onChange={handleChange}
            required
            className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4"
          />

          <select
            name="categoria"
            value={form.categoria}
            onChange={handleChange}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4"
          >
            {categorias.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>

          <textarea
            name="descripcion"
            placeholder="Descripción completa del local"
            value={form.descripcion}
            onChange={handleChange}
            required
            className="w-full min-h-[160px] bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4"
          />

          <input
            type="text"
            name="direccion"
            placeholder="Dirección visible para turistas"
            value={form.direccion}
            onChange={handleChange}
            required
            className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4"
          />

          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="number"
              step="any"
              name="lat"
              placeholder="Latitud"
              value={form.lat}
              onChange={handleChange}
              required
              className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4"
            />

            <input
              type="number"
              step="any"
              name="lng"
              placeholder="Longitud"
              value={form.lng}
              onChange={handleChange}
              required
              className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4"
            />

            <button
              type="button"
              onClick={usarUbicacionActual}
              className="bg-zinc-800 hover:bg-zinc-700 rounded-2xl px-5 py-4 font-bold transition"
            >
              Usar ubicación actual
            </button>
          </div>

          <input
            type="number"
            name="precioPromedio"
            placeholder="Precio promedio aproximado"
            value={form.precioPromedio}
            onChange={handleChange}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4"
          />

          <div>
            <label className="block text-zinc-300 mb-2">
              Foto del local
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
                    foto: url
                  });

                  toast.success("Imagen subida");
                }
              }}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4"
            />

            {form.foto && (
              <img
                src={form.foto}
                alt="local"
                className="w-full h-64 object-cover rounded-2xl mt-4"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={guardando}
            className="w-full bg-orange-500 hover:bg-orange-600 py-5 rounded-2xl font-bold transition"
          >
            {guardando ? "Guardando..." : "Guardar local"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}

export default AgregarLocal;
