import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import DashboardLayout from "../components/DashboardLayout";
import CarruselEventos from "../components/CarruselEventos";
import toast from "react-hot-toast";

function Turista() {
  const navigate = useNavigate();
  const [rutas, setRutas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tipoRuta, setTipoRuta] = useState("todas");
  const [duracionRuta, setDuracionRuta] = useState("media");
  const [cargandoCatalogo, setCargandoCatalogo] = useState(false);


  const imagenRuta = (ruta) => {
    const primerLugar = ruta.lugares?.[0];

    if (primerLugar?.fotos?.[0]) {
      return primerLugar.fotos[0];
    }

    return "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee";
  };

  const generarCatalogo = async ({
    tipo = tipoRuta,
    duracion = duracionRuta
  }) => {
    try {
      setCargandoCatalogo(true);
      setLoading(true);

      let ubicacion = null;

      if (tipo === "cercana" && navigator.geolocation) {
        ubicacion = await new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              resolve({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
              });
            },
            () => resolve(null)
          );
        });
      }

      const res = await api.post("/rutas/generar-catalogo", {
        tipo,
        duracion,
        ubicacion
      });

      setRutas(res.data.rutas);
    } catch (error) {
      toast.error("Error al generar catálogo");
    } finally {
      setCargandoCatalogo(false);
      setLoading(false);
    }
  };


  useEffect(() => {
    generarCatalogo({
      tipo: "todas",
      duracion: "media"
    });
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-zinc-950 text-white px-8 py-10">

          {/* HERO SKELETON */}
          <section className="relative px-8 py-16 overflow-hidden">

            <div className="relative z-10">
              <div className="
                h-12
                w-96
bg-zinc-800
                rounded-2xl
                animate-pulse
              " />

              <div className="
                h-6
                w-72
bg-zinc-800
                rounded-xl
                mt-6
                animate-pulse
              " />

              {/* GENERATOR CARD SKELETON */}
              <div className="
bg-zinc-900
                border
border-zinc-800
                rounded-3xl
                p-6
                mt-10
              ">

                <div className="
                  h-8
                  w-48
  bg-zinc-800
                  rounded-xl
                  animate-pulse
                " />

                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div className="
                    h-12
    bg-zinc-800
                    rounded-xl
                    animate-pulse
                  " />

                  <div className="
                    h-12
    bg-zinc-800
                    rounded-xl
                    animate-pulse
                  " />
                </div>

                <div className="
                  h-12
                  w-48
  bg-zinc-800
                  rounded-2xl
                  mt-6
                  animate-pulse
                " />
              </div>

              {/* CATEGORY BUTTONS SKELETON */}
              <div className="flex flex-wrap gap-4 mt-10">
                {
                  Array.from({ length: 5 }).map((_, i) => (

                    <div
                      key={i}
                      className="
                        h-12
                        w-32
        bg-zinc-800
                        rounded-xl
                        animate-pulse
                      "
                    />
                  ))
                }
              </div>

            </div>
          </section>

          {/* ROUTES GRID SKELETON */}
          <section className="px-8 pb-16">
            <div className="
              h-10
              w-64
              bg-zinc-800
              rounded-xl
              mb-8
              animate-pulse
            " />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {
                Array.from({ length: 6 }).map((_, i) => (

                  <div
                    key={i}
                    className="
      bg-zinc-900
                      border
      border-zinc-800
                      rounded-3xl
                      overflow-hidden
                    "
                  >

                    <div className="
                      h-52
      bg-zinc-800
                      animate-pulse
                    " />

                    <div className="p-6">

                      <div className="
                        h-8
        bg-zinc-800
                        rounded-xl
                        animate-pulse
                      " />

                      <div className="
                        h-4
        bg-zinc-800
                        rounded-xl
                        mt-4
                        animate-pulse
                      " />

                      <div className="
                        grid
                        grid-cols-2
                        gap-4
                        mt-6
                      ">

                        <div className="
                          h-20
          bg-zinc-800
                          rounded-2xl
                          animate-pulse
                        " />

                        <div className="
                          h-20
          bg-zinc-800
                          rounded-2xl
                          animate-pulse
                        " />

                      </div>

                      <div className="
                        h-14
        bg-zinc-800
                        rounded-2xl
                        mt-6
                        animate-pulse
                      " />

                    </div>

                  </div>
                ))
              }
            </div>
          </section>

        </div>
      </DashboardLayout>
    );
  }


  return (
    <DashboardLayout>
      <div className="min-h-screen bg-zinc-950 text-white px-8 py-10">
        
      {/* HERO */}
      <section className="relative px-5 md:px-8 py-16 overflow-hidden">
        <div className="relative z-10 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-black leading-tight">
            Descubre rutas inteligentes
          </h1>

          <p className="text-zinc-400 text-lg mt-5 max-w-2xl">
            Explora recorridos organizados automáticamente con lugares reales, mapas y experiencias cercanas.
          </p>
        </div>
      </section>

      {/* EVENTOS */}
      <CarruselEventos />

      {/* FILTROS */}
      <section className="px-5 md:px-8 py-8">
        <h2 className="text-2xl font-black mb-5">
          Filtrar rutas
        </h2>

        <div className="flex flex-wrap gap-3 mb-6">
          {[
            { value: "todas", label: "Todas" },
            { value: "economica", label: "Económicas" },
            { value: "equilibrada", label: "Equilibradas" },
            { value: "mejor_calificada", label: "Mejor calificadas" },
            { value: "cercana", label: "Cercanas" }
          ].map((filtro) => (
            <button
              key={filtro.value}
              onClick={() => {
                setTipoRuta(filtro.value);
                generarCatalogo({
                  tipo: filtro.value,
                  duracion: duracionRuta
                });
              }}
              disabled={cargandoCatalogo}
              className={`px-5 py-3 rounded-xl font-bold transition ${
                tipoRuta === filtro.value
                  ? "bg-orange-500 text-white"
                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              {filtro.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          {[
            { value: "todas", label: "Cualquier duración" },
            { value: "corta", label: "Corta: hasta 2h" },
            { value: "media", label: "Media: 2–4h" },
            { value: "larga", label: "Larga: 4h+" }
          ].map((filtro) => (
            <button
              key={filtro.value}
              onClick={() => {
                setDuracionRuta(filtro.value);
                generarCatalogo({
                  tipo: tipoRuta,
                  duracion: filtro.value
                });
              }}
              disabled={cargandoCatalogo}
              className={`px-5 py-3 rounded-xl font-bold transition ${
                duracionRuta === filtro.value
                  ? "bg-orange-500 text-white"
                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              {filtro.label}
            </button>
          ))}
        </div>
      </section>

      {/* RUTAS */}
      <section className="px-8 pb-16">
        <h3 className="text-3xl font-bold mb-8">
          Catálogo de rutas turísticas
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {rutas.length === 0 && (
            <div className="col-span-full bg-zinc-900 border border-zinc-800 rounded-3xl p-10 text-center">
              <div className="text-6xl mb-5">🗺️</div>

              <h2 className="text-3xl font-black">
                No hay rutas disponibles
              </h2>

              <p className="text-zinc-400 mt-3">
                {cargandoCatalogo ? "Generando catálogo..." : "Prueba con otra categoría o duración."}
              </p>
            </div>
          )}

          {rutas.map((ruta) => (
            <div
              key={ruta._id}
              className="group bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden hover:border-orange-500 hover:-translate-y-1 transition"
            >
              <div
                className="h-56 bg-cover bg-center relative"
                style={{
                  backgroundImage: `url(${imagenRuta(ruta)})`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                <div className="absolute top-4 left-4">
                  <span className="bg-orange-500/90 text-white px-4 py-2 rounded-full text-sm font-bold">
                    {ruta.tipoRuta}
                  </span>
                </div>

                <div className="absolute bottom-5 left-5 right-5">
                  <h2 className="text-2xl font-black leading-tight">
                    {ruta.nombre}
                  </h2>

                  <p className="text-zinc-300 text-sm mt-2 line-clamp-2">
                    {ruta.descripcion}
                  </p>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-zinc-800 rounded-2xl p-4">
                    <p className="text-zinc-400 text-xs">
                      Duración
                    </p>

                    <h4 className="font-bold mt-1">
                      {ruta.duracionEstimada || "No definida"}
                    </h4>
                  </div>

                  <div className="bg-zinc-800 rounded-2xl p-4">
                    <p className="text-zinc-400 text-xs">
                      Precio
                    </p>

                    <h4 className="font-bold mt-1">
                      Q{ruta.precioEstimado || 0}
                    </h4>
                  </div>

                  <div className="bg-zinc-800 rounded-2xl p-4">
                    <p className="text-zinc-400 text-xs">
                      Lugares
                    </p>

                    <h4 className="font-bold mt-1">
                      {ruta.lugares?.length || 0}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6">
                  <div>
                    <p className="text-zinc-400 text-sm">
                      Dificultad
                    </p>

                    <h4 className="font-bold">
                      {ruta.dificultad || "baja"}
                    </h4>
                  </div>

                  <button
                    onClick={() => {
                      localStorage.setItem(
                        "rutaSeleccionada",
                        JSON.stringify(ruta)
                      );

                      navigate("/ruta-detalle");
                    }}
                    className="bg-orange-500 hover:bg-orange-600 px-5 py-3 rounded-2xl font-bold transition"
                  >
                    Ver ruta
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
    </DashboardLayout>
  );
}

export default Turista;