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
  const [modoFoto, setModoFoto] = useState("url");

  const [form, setForm] = useState({
    nombre: "",
    categoria: "GAS",
    descripcion: "",
    direccion: "",
    lat: "",
    lng: "",
    linkMaps: "",
    precioPromedio: "",
    foto: "",
    urlFoto: ""
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // --- Parsear coordenadas desde un link de Google Maps ---
  const parsearLinkMaps = (link) => {
    const m1 = link.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (m1) return { lat: parseFloat(m1[1]), lng: parseFloat(m1[2]) };

    const m2 = link.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (m2) return { lat: parseFloat(m2[1]), lng: parseFloat(m2[2]) };

    const m3 = link.match(/[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (m3) return { lat: parseFloat(m3[1]), lng: parseFloat(m3[2]) };

    return null;
  };

  const handleLinkMaps = (e) => {
    const link = e.target.value;
    setForm((prev) => ({ ...prev, linkMaps: link }));

    const coords = parsearLinkMaps(link);
    if (coords) {
      setForm((prev) => ({
        ...prev,
        linkMaps: link,
        lat: coords.lat,
        lng: coords.lng
      }));
      toast.success(
        `Coordenadas detectadas: ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`
      );
    }
  };

  // --- GPS del navegador ---
  const usarUbicacionActual = () => {
    if (!navigator.geolocation) {
      toast.error("Tu navegador no permite obtener ubicación");
      return;
    }
    const t = toast.loading("Obteniendo ubicación...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        toast.dismiss(t);
        setForm((prev) => ({
          ...prev,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          linkMaps: ""
        }));
        toast.success(
          `Ubicación detectada: ${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`
        );
      },
      (err) => {
        toast.dismiss(t);
        if (err.code === 1) {
          toast.error("Permiso denegado. Habilita la ubicación en tu navegador.");
        } else if (err.code === 2) {
          toast.error("No se pudo detectar la ubicación. Verifica tu GPS.");
        } else {
          toast.error("Tiempo agotado. Intenta de nuevo.");
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // --- Subir imagen por archivo ---
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

  const fotoFinal = modoFoto === "url" ? form.urlFoto : form.foto;

  // --- Guardar local ---
  const crearLocal = async (e) => {
    e.preventDefault();

    if (!form.lat || !form.lng) {
      toast.error("Debes capturar la ubicación (link de Maps o botón GPS)");
      return;
    }
    if (!fotoFinal) {
      toast.error("Agrega una foto al local");
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
        <h1 className="text-4xl font-black text-red-500">PRUEBA NUEVA INTERFAZ</h1>
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

          {/* Dirección de texto */}
          <input
            type="text"
            name="direccion"
            placeholder="Dirección visible para turistas (ej: 4a Calle 5-23, Zona 1)"
            value={form.direccion}
            onChange={handleChange}
            required
            className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition"
          />

          {/* UBICACIÓN — link de Maps o GPS */}
          <div>
            <label className="block text-zinc-300 font-semibold mb-3">
              Ubicación del local
            </label>

            {/* Campo link Google Maps */}
            <input
              type="text"
              name="linkMaps"
              value={form.linkMaps}
              onChange={handleLinkMaps}
              placeholder="Pega aquí el link de Google Maps del local"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition"
            />
            <p className="text-zinc-500 text-xs mt-2 mb-4">
              Abre Google Maps → busca tu local → toca <strong className="text-zinc-400">Compartir</strong> → copia el link y pégalo aquí. Las coordenadas se detectan solas.
            </p>

            {/* Botón GPS */}
            <button
              type="button"
              onClick={usarUbicacionActual}
              className="w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-2xl px-5 py-4 font-bold transition flex items-center justify-center gap-2"
            >
              📍 O usar mi ubicación actual (GPS)
            </button>

            {/* Confirmación de coordenadas */}
            {form.lat && form.lng ? (
              <div className="mt-3 bg-green-500/10 border border-green-500/30 rounded-2xl px-5 py-3 flex items-center gap-3">
                <span className="text-green-400 text-xl">✓</span>
                <div>
                  <p className="text-green-400 font-bold text-sm">Coordenadas capturadas correctamente</p>
                  <p className="text-zinc-400 text-xs mt-0.5">
                    Lat: {Number(form.lat).toFixed(6)} · Lng: {Number(form.lng).toFixed(6)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-3 bg-zinc-800/50 border border-zinc-700 rounded-2xl px-5 py-3">
                <p className="text-zinc-500 text-sm">⚠ Aún no se han capturado coordenadas</p>
              </div>
            )}
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

          {/* FOTO */}
          <div>
            <label className="block text-zinc-300 font-semibold mb-3">
              Foto del local
            </label>

            {/* Tabs */}
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
                  type="text"
                  name="urlFoto"
                  placeholder="https://ejemplo.com/foto.jpg — pega aquí el enlace de la imagen"
                  value={form.urlFoto}
                  onChange={handleChange}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition"
                />
                <p className="text-zinc-500 text-xs mt-2">
                  Puedes usar un enlace de Google Photos, Imgur u otro servicio de imágenes.
                </p>
              </div>
            )}

            {/* Modo archivo */}
            {modoFoto === "archivo" && (
              <label
                className={`flex items-center gap-4 cursor-pointer bg-zinc-800 border border-dashed border-zinc-600 hover:border-orange-500 rounded-2xl px-5 py-5 transition ${
                  subiendo ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <span className="text-3xl">📷</span>
                <div>
                  <p className="font-semibold text-white">
                    {subiendo ? "Subiendo imagen..." : "Seleccionar archivo"}
                  </p>
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
                      setForm((prev) => ({ ...prev, foto: url }));
                      toast.success("Imagen subida");
                    }
                  }}
                />
              </label>
            )}

            {/* Preview */}
            {fotoFinal && (
              <div className="mt-4 relative">
                <img
                  src={fotoFinal}
                  alt="Preview del local"
                  className="w-full h-64 object-cover rounded-2xl border border-zinc-700"
                  onError={(e) => {
                    e.target.style.display = "none";
                    toast.error("No se pudo cargar la imagen. Verifica el enlace.");
                  }}
                />
                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      urlFoto: modoFoto === "url" ? "" : prev.urlFoto,
                      foto: modoFoto === "archivo" ? "" : prev.foto
                    }))
                  }
                  className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold transition text-lg"
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
