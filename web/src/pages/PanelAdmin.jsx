import React, { useEffect, useState } from "react";
import api from "../api/api";
import DashboardLayout from "../components/DashboardLayout";
import toast from "react-hot-toast";

const UBICACION_EMPTY = { nombre: "", lat: "", lng: "", linkMaps: "" };
const FORM_EMPTY = {
  titulo: "",
  descripcion: "",
  imagen: "",
  ubicacion: { ...UBICACION_EMPTY },
  fechaEvento: ""
};

function PanelAdmin() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState(FORM_EMPTY);

  const cargarEventos = async () => {
    try {
      const res = await api.get("/eventos/admin");
      setEventos(res.data);
    } catch {
      toast.error("Error al cargar eventos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEventos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("ubicacion.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        ubicacion: { ...prev.ubicacion, [key]: value }
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImagen = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSubiendo(true);
    try {
      const data = new FormData();
      data.append("imagen", file);
      const res = await api.post("/upload/imagen", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setForm((prev) => ({ ...prev, imagen: res.data.url }));
      toast.success("Imagen subida");
    } catch {
      toast.error("Error al subir imagen");
    } finally {
      setSubiendo(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.titulo || !form.descripcion || !form.imagen || !form.ubicacion.nombre) {
      toast.error("Completa todos los campos requeridos");
      return;
    }
    setEnviando(true);
    try {
      await api.post("/eventos", {
        ...form,
        ubicacion: {
          ...form.ubicacion,
          lat: form.ubicacion.lat ? parseFloat(form.ubicacion.lat) : null,
          lng: form.ubicacion.lng ? parseFloat(form.ubicacion.lng) : null
        },
        fechaEvento: form.fechaEvento || null
      });
      toast.success("Evento creado");
      setForm(FORM_EMPTY);
      setMostrarForm(false);
      cargarEventos();
    } catch (err) {
      toast.error(err.response?.data?.mensaje || "Error al crear evento");
    } finally {
      setEnviando(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!confirm("¿Eliminar este evento permanentemente?")) return;
    try {
      await api.delete(`/eventos/${id}`);
      toast.success("Evento eliminado");
      cargarEventos();
    } catch {
      toast.error("Error al eliminar");
    }
  };

  const handleToggle = async (id) => {
    try {
      await api.patch(`/eventos/${id}/toggle`);
      cargarEventos();
    } catch {
      toast.error("Error al actualizar estado");
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-zinc-950 text-white px-5 md:px-8 py-10">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="bg-orange-500 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">
                Admin
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black">Panel de Eventos</h1>
            <p className="text-zinc-400 mt-1">Gestiona el carrusel de eventos en la pantalla principal.</p>
          </div>
          <button
            onClick={() => setMostrarForm((v) => !v)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-bold transition flex items-center gap-2"
          >
            {mostrarForm ? "✕ Cancelar" : "+ Agregar evento"}
          </button>
        </div>

        {/* Formulario de nuevo evento */}
        {mostrarForm && (
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-6 md:p-8 mb-10">
            <h2 className="text-xl font-black mb-6">Nuevo evento</h2>

            <div className="grid md:grid-cols-2 gap-5">
              {/* Título */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Título *
                </label>
                <input
                  name="titulo"
                  value={form.titulo}
                  onChange={handleChange}
                  placeholder="Nombre del evento"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition"
                />
              </div>

              {/* Descripción */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Descripción *
                </label>
                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Descripción breve del evento"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition resize-none"
                />
              </div>

              {/* Imagen */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Imagen *
                </label>
                <div className="flex flex-wrap gap-3 items-start">
                  <label className="cursor-pointer bg-zinc-800 border border-dashed border-zinc-600 hover:border-orange-500 rounded-xl px-5 py-3 text-zinc-400 hover:text-orange-400 transition text-sm font-medium flex items-center gap-2">
                    {subiendo ? "Subiendo..." : "📷 Subir imagen"}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImagen} disabled={subiendo} />
                  </label>
                  {form.imagen && (
                    <div className="relative">
                      <img
                        src={form.imagen}
                        alt="Preview"
                        className="h-16 w-24 object-cover rounded-xl border border-zinc-700"
                      />
                      <button
                        onClick={() => setForm((p) => ({ ...p, imagen: "" }))}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Ubicación nombre */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Nombre del lugar *
                </label>
                <input
                  name="ubicacion.nombre"
                  value={form.ubicacion.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Parque Central, Xela"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition"
                />
              </div>

              {/* Fecha */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Fecha del evento
                </label>
                <input
                  type="date"
                  name="fechaEvento"
                  value={form.fechaEvento}
                  onChange={handleChange}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition"
                />
              </div>

              {/* Link Maps */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Link de Google Maps (opcional)
                </label>
                <input
                  name="ubicacion.linkMaps"
                  value={form.ubicacion.linkMaps}
                  onChange={handleChange}
                  placeholder="https://maps.google.com/..."
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={handleSubmit}
                disabled={enviando || subiendo}
                className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-8 py-3 rounded-2xl font-bold transition"
              >
                {enviando ? "Guardando..." : "Guardar evento"}
              </button>
            </div>
          </div>
        )}

        {/* Lista de eventos */}
        <div>
          <h2 className="text-xl font-black mb-5 text-zinc-300">
            Eventos actuales
            <span className="ml-3 text-zinc-500 font-normal text-base">({eventos.length})</span>
          </h2>

          {loading ? (
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-zinc-800 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : eventos.length === 0 ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 text-center">
              <div className="text-5xl mb-4">🎉</div>
              <p className="text-zinc-400">No hay eventos todavía. Agrega el primero.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {eventos.map((ev) => (
                <div
                  key={ev._id}
                  className={`bg-zinc-900 border rounded-2xl p-4 flex flex-wrap gap-4 items-center transition ${
                    ev.activo ? "border-zinc-700" : "border-zinc-800 opacity-50"
                  }`}
                >
                  {/* Imagen miniatura */}
                  <img
                    src={ev.imagen}
                    alt={ev.titulo}
                    className="h-16 w-20 object-cover rounded-xl flex-shrink-0"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-white truncate">{ev.titulo}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        ev.activo ? "bg-green-500/20 text-green-400" : "bg-zinc-700 text-zinc-400"
                      }`}>
                        {ev.activo ? "Visible" : "Oculto"}
                      </span>
                    </div>
                    <p className="text-zinc-400 text-sm truncate mt-0.5">{ev.descripcion}</p>
                    <p className="text-zinc-500 text-xs mt-1">
                      📍 {ev.ubicacion?.nombre}
                      {ev.fechaEvento && (
                        <span className="ml-3">
                          📅 {new Date(ev.fechaEvento).toLocaleDateString("es-GT")}
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Acciones */}
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleToggle(ev._id)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition ${
                        ev.activo
                          ? "bg-zinc-700 hover:bg-zinc-600 text-zinc-300"
                          : "bg-green-600 hover:bg-green-500 text-white"
                      }`}
                    >
                      {ev.activo ? "Ocultar" : "Mostrar"}
                    </button>
                    <button
                      onClick={() => handleEliminar(ev._id)}
                      className="bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white px-4 py-2 rounded-xl text-sm font-bold transition"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default PanelAdmin;
