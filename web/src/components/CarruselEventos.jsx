import React, { useEffect, useRef, useState } from "react";
import api from "../api/api";

const INTERVALO_MS = 3000;

function CarruselEventos() {
  const [eventos, setEventos] = useState([]);
  const [indice, setIndice] = useState(0);
  const [eventoAbierto, setEventoAbierto] = useState(null);
  const [loading, setLoading] = useState(true);

  // drag/swipe state
  const startX = useRef(null);
  const isDragging = useRef(false);
  const trackRef = useRef(null);
  const autoRef = useRef(null);

  useEffect(() => {
    api.get("/eventos")
      .then((res) => setEventos(res.data))
      .catch(() => setEventos([]))
      .finally(() => setLoading(false));
  }, []);

  // Auto-advance
  useEffect(() => {
    if (eventos.length < 2) return;
    autoRef.current = setInterval(() => {
      setIndice((prev) => (prev + 1) % eventos.length);
    }, INTERVALO_MS);
    return () => clearInterval(autoRef.current);
  }, [eventos.length]);

  const irA = (i) => {
    clearInterval(autoRef.current);
    setIndice(i);
  };

  const anterior = () => irA((indice - 1 + eventos.length) % eventos.length);
  const siguiente = () => irA((indice + 1) % eventos.length);

  // Touch / mouse swipe
  const onPointerDown = (e) => {
    startX.current = e.clientX ?? e.touches?.[0]?.clientX;
    isDragging.current = true;
  };

  const onPointerUp = (e) => {
    if (!isDragging.current || startX.current === null) return;
    const endX = e.clientX ?? e.changedTouches?.[0]?.clientX;
    const diff = startX.current - endX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? siguiente() : anterior();
    }
    isDragging.current = false;
    startX.current = null;
  };

  if (loading) {
    return (
      <section className="px-5 md:px-8 mb-8">
        <div className="h-8 w-40 bg-zinc-800 rounded-xl animate-pulse mb-4" />
        <div className="h-72 bg-zinc-800 rounded-3xl animate-pulse" />
      </section>
    );
  }

  if (eventos.length === 0) return null;

  const evento = eventos[indice];

  return (
    <>
      <section className="px-5 md:px-8 mb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎉</span>
            <h2 className="text-2xl font-black text-white">Eventos próximos</h2>
          </div>
          <span className="text-zinc-500 text-sm font-medium">
            {indice + 1} / {eventos.length}
          </span>
        </div>

        {/* Carrusel */}
        <div
          className="relative overflow-hidden rounded-3xl cursor-grab active:cursor-grabbing select-none"
          style={{ userSelect: "none" }}
          onMouseDown={onPointerDown}
          onMouseUp={onPointerUp}
          onMouseLeave={() => { isDragging.current = false; }}
          onTouchStart={onPointerDown}
          onTouchEnd={onPointerUp}
          ref={trackRef}
        >
          {/* Slide */}
          <div
            key={evento._id}
            className="relative h-72 md:h-80 bg-cover bg-center transition-all duration-500"
            style={{ backgroundImage: `url(${evento.imagen})` }}
          >
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent rounded-3xl" />

            {/* Badge ubicación */}
            <div className="absolute top-4 left-4">
              <span className="bg-black/60 backdrop-blur-sm text-white border border-white/20 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5">
                <span>📍</span>
                {evento.ubicacion?.nombre}
              </span>
            </div>

            {/* Flechas de navegación */}
            {eventos.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); anterior(); }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm border border-white/20 text-white rounded-full w-9 h-9 flex items-center justify-center hover:bg-black/70 transition z-10"
                >
                  ‹
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); siguiente(); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm border border-white/20 text-white rounded-full w-9 h-9 flex items-center justify-center hover:bg-black/70 transition z-10"
                >
                  ›
                </button>
              </>
            )}

            {/* Contenido inferior */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-xl md:text-2xl font-black text-white leading-tight">
                {evento.titulo}
              </h3>
              <p className="text-zinc-300 text-sm mt-1 line-clamp-2">
                {evento.descripcion}
              </p>

              <button
                onClick={() => setEventoAbierto(evento)}
                className="mt-3 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition"
              >
                Ver detalles
              </button>
            </div>
          </div>

          {/* Dots indicadores */}
          {eventos.length > 1 && (
            <div className="absolute bottom-4 right-6 flex gap-1.5">
              {eventos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => irA(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === indice ? "w-6 bg-orange-500" : "w-1.5 bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal de detalle del evento */}
      {eventoAbierto && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end md:items-center justify-center p-4"
          onClick={() => setEventoAbierto(null)}
        >
          <div
            className="bg-zinc-900 border border-zinc-700 rounded-3xl w-full max-w-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Imagen */}
            <div
              className="h-52 bg-cover bg-center relative"
              style={{ backgroundImage: `url(${eventoAbierto.imagen})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <button
                onClick={() => setEventoAbierto(null)}
                className="absolute top-4 right-4 bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/80 transition text-lg"
              >
                ×
              </button>
            </div>

            {/* Info */}
            <div className="p-6">
              <h3 className="text-2xl font-black text-white">{eventoAbierto.titulo}</h3>
              <p className="text-zinc-400 mt-3 text-sm leading-relaxed">{eventoAbierto.descripcion}</p>

              {/* Ubicación */}
              <div className="mt-5 bg-zinc-800 rounded-2xl p-4 flex items-start gap-3">
                <span className="text-2xl">📍</span>
                <div>
                  <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Ubicación</p>
                  <p className="text-white font-bold mt-0.5">{eventoAbierto.ubicacion?.nombre}</p>
                  {eventoAbierto.ubicacion?.linkMaps && (
                    <a
                      href={eventoAbierto.ubicacion.linkMaps}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-400 text-sm hover:text-orange-300 mt-1 inline-block"
                    >
                      Ver en Google Maps →
                    </a>
                  )}
                </div>
              </div>

              {/* Fecha si existe */}
              {eventoAbierto.fechaEvento && (
                <div className="mt-3 bg-zinc-800 rounded-2xl p-4 flex items-start gap-3">
                  <span className="text-2xl">📅</span>
                  <div>
                    <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Fecha</p>
                    <p className="text-white font-bold mt-0.5">
                      {new Date(eventoAbierto.fechaEvento).toLocaleDateString("es-GT", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </p>
                  </div>
                </div>
              )}

              <button
                onClick={() => setEventoAbierto(null)}
                className="mt-5 w-full bg-zinc-700 hover:bg-zinc-600 text-white py-3 rounded-2xl font-bold transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CarruselEventos;
