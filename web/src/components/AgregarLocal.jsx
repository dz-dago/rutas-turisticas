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
  const [subiendo, setSubiendo] = useState(false);
  // "url" = pegar enlace, "archivo" = subir archivo
  const [modoFoto, setModoFoto] = useState("url");

  const [form, setForm] = useState({
    nombre: "",
    categoria: "GAS",
    descripcion: "",
    direccion: "",
    lat: "",
    lng: "",
    precioPromedio: "",
    foto: "",
    urlFoto: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const subirImagen = async (archivo) => {
    try {
      setSubiendo(true);
      const formData = new FormData();
      formData.append("imagen", archivo);
      const res = await api.post("/upload/imagen", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return res.data.url;
    } catch {
      toast.error("Error al subir imagen");
      return "";
    } finally {
      setSubiendo(false);
    }
  };

  // La foto final es la URL pegada o la subida
  const fotoFinal = modoFoto === "url" ? form.urlFoto : form.foto;

  const usarUbicacionActual = () => {
    if (!navigator.geolocation) {
      toast.error("Tu navegador no permite obtener ubicación");
      return;
    }
    const t = toast.loading("Obteniendo ubicación...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        toast.dismiss(t);
        setForm({ ...form, lat: pos.coords.latitude, lng: pos.coords.longitude });
        toast.success("Ubicación detectada");
      },
      () => {
        toast.dismiss(t);
        toast.error("No se pudo obtener la ubicación");
      }
    );
  };

  const crearLocal = async (e) => {
    e.preventDefault();
    if (!fotoFinal) {
      toast.error("Agrega una foto al local (URL o archivo)");
      return;
    }
    try {
      setGuardando(true);
      const t = toast.loading("Guardando local...");
      await api.post("/locales/mis-locales", {
        nombre: form.nombre,
        categoria: form.categoria,
        descripcion: form.descripcion,
        ubicacion: {
          lat: Number(form.lat),
          lng: Number(form.lng),
          direccion: form.direccion
        },
        fotos: [fotoFinal],
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
      toast.dismiss(t);
      toast.success("Local creado correctamente");
      navigate("/propietario/locales");
    } catch (error) {
      toast.error(error.response?.data?.mensaje || "Error al crear local");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-zinc-950 text-white px-5 md:px-8 py-10">
        <h1 className="text-4xl font-black">Agregar local</h1>
        <p className="text-zinc-400 mt-3 max-w-3xl">
          Registra tu local. Se guardará como pendiente y será visible en la plataforma cuando tenga suscripción activa.
        </p>

        <form
          onSubmit={crearLocal}
          className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 mt-10 max-w-4xl space-y-6"
        >
          {/* Nombre */}
          <input
            type="text"
            name="nombre"
            placeholder="Nombre del local"
            value={form.nombre}
            onChange={handleChange}
            required
            className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition"
          />

          {/* Categoría */}
          <select
            name="categoria"
            value={form.categoria}
            onChange={handleChange}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-orange-500 transition"
          >
            {categorias.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>

          {/* Descripción */}
          <textarea
            name="descripcion"
            placeholder="Descripción completa del local"
            value={form.descripcion}
            onChange={handleChange}
            required
            className="w-full min-h-[160px] bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition resize-none"
          />

          {/* Dirección */}
          <input
            type="text"
            name="direccion"
            placeholder="Dirección visible para turistas"
            value={form.direccion}
            onChange={handleChange}
            required
            className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition"
          />

          {/* Coordenadas */}
          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="number"
              step="any"
              name="lat"
              placeholder="Latitud"
              value={form.lat}
              onChange={handleChange}
              required
              className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition"
            />
            <input
              type="number"
              step="any"
              name="lng"
              placeholder="Longitud"
              value={form.lng}
              onChange={handleChange}
              required
              className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition"
            />
            <button
              type="button"
              onClick={usarUbicacionActual}
              className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-2xl px-5 py-4 font-bold transition"
            >
              📍 Usar ubicación actual
            </button>
          </div>

          {/* Precio */}
          <input
            type="number"
            name="precioPromedio"
            placeholder="Precio promedio aproximado (Q)"
            value={form.precioPromedio}
            onChange={handleChange}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition"
          />

          {/* Foto — selector de modo */}
          <div>
            <label className="block text-zinc-300 font-semibold mb-3">
              Foto del local
            </label>

            {/* Tabs modo */}
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => setModoFoto("url")}
                className={`px-5 py-2 rounded-xl font-bold text-sm transition ${
                  modoFoto === "url"
                    ? "bg-orange-500 text-white"
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                }`}
              >
                🔗 Pegar enlace
              </button>
              <button
                type="button"
                onClick={() => setModoFoto("archivo")}
                className={`px-5 py-2 rounded-xl font-bold text-sm transition ${
                  modoFoto === "archivo"
                    ? "bg-orange-500 text-white"
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                }`}
              >
                📷 Subir archivo
              </button>
            </div>

            {/* Modo URL */}
            {modoFoto === "url" && (
              <div>
                <input
                  type="url"
                  name="urlFoto"
                  placeholder="https://ejemplo.com/foto.jpg  —  pega aquí el enlace de la imagen"
                  value={form.urlFoto}
                  onChange={handleChange}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition"
                />
                <p className="text-zinc-500 text-xs mt-2">
                  Puedes usar un enlace de Google Photos, Imgur, Unsplash u otro servicio de imágenes.
                </p>
              </div>
            )}

            {/* Modo archivo */}
            {modoFoto === "archivo" && (
              <div>
                <label className={`flex items-center gap-3 cursor-pointer bg-zinc-800 border border-dashed border-zinc-600 hover:border-orange-500 rounded-2xl px-5 py-4 transition ${subiendo ? "opacity-50 pointer-events-none" : ""}`}>
                  <span className="text-2xl">📷</span>
                  <div>
                    <p className="font-semibold text-white">{subiendo ? "Subiendo imagen..." : "Seleccionar archivo"}</p>
                    <p className="text-zinc-500 text-xs mt-0.5">JPG, PNG, JPEG · Máx. 5MB</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={subiendo}
                    onChange={async (e) => {
                      const archivo = e.target.files[0];
                      if (!archivo) return;
                      const t = toast.loading("Subiendo imagen...");
                      const url = await subirImagen(archivo);
                      toast.dismiss(t);
                      if (url) {
                        setForm({ ...form, foto: url });
                        toast.success("Imagen subida");
                      }
                    }}
                  />
                </label>
              </div>
            )}

            {/* Preview de la foto */}
            {fotoFinal && (
              <div className="mt-4 relative">
                <img
                  src={fotoFinal}
                  alt="Preview del local"
                  className="w-full h-64 object-cover rounded-2xl border border-zinc-700"
                  onError={(e) => {
                    e.target.style.display = "none";
                    toast.error("No se pudo cargar la imagen, verifica el enlace");
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (modoFoto === "url") setForm({ ...form, urlFoto: "" });
                    else setForm({ ...form, foto: "" });
                  }}
                  className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold transition"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={guardando || subiendo}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 py-5 rounded-2xl font-bold transition"
          >
            {guardando ? "Guardando..." : "Guardar local"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}

export default AgregarLocal;
