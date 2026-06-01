import React, { useEffect, useState } from "react";
import api from "../api/api";
import toast from "react-hot-toast";
import DashboardLayout from "../components/DashboardLayout";

function ExplorarLocales() {
  const [locales, setLocales] = useState([]);
  const [categoria, setCategoria] = useState("TODAS");
  const [loading, setLoading] = useState(true);

  const categorias = ["TODAS", "CAF", "CUL", "EXP", "GAS", "ENT", "NAT", "HIS", "REL", "HOS"];

  const cargarLocales = async () => {
    try {
      const res = await api.get("/locales");
      setLocales(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar locales");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarLocales();
  }, []);

  const localesFiltrados =
    categoria === "TODAS"
      ? locales
      : locales.filter((local) => local.categoria === categoria);

  if (loading) {
    return (

      <div className="
        min-h-screen
        bg-zinc-950
        text-white
        px-8
        py-10
      ">

        <div className="
          h-12
          w-72
          bg-zinc-800
          rounded-2xl
          animate-pulse
        " />

        <div className="
          h-6
          w-96
          bg-zinc-900
          rounded-xl
          mt-5
          animate-pulse
        " />

        <div className="
          flex
          flex-wrap
          gap-3
          mt-8
        ">

          {
            Array.from({ length: 6 }).map((_, i) => (

              <div
                key={i}
                className="
                  h-12
                  w-28
                  bg-zinc-800
                  rounded-2xl
                  animate-pulse
                "
              />
            ))
          }

        </div>

        <div className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3
          gap-8
          mt-10
        ">

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
                    h-4
                    bg-zinc-800
                    rounded-xl
                    mt-3
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

      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-zinc-950 text-white px-8 py-10">
      <h1 className="text-4xl font-black text-orange-400">
        Explorar Locales
      </h1>

      <p className="text-zinc-400 mt-3 max-w-2xl">
        Revisa cafeterías, restaurantes, parques, experiencias y lugares recomendados.
      </p>

      <div className="flex flex-wrap gap-3 mt-8">
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoria(cat)}
            className={`px-4 py-3 rounded-xl font-semibold transition ${
              categoria === cat
                ? "bg-orange-500 text-white"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-10">
        {localesFiltrados.length === 0 && (

          <div className="
            col-span-full
            bg-zinc-900
            border
            border-zinc-800
            rounded-3xl
            p-10
            text-center
          ">

            <div className="text-6xl mb-5">
              📍
            </div>

            <h2 className="
              text-3xl
              font-black
            ">
              No hay locales disponibles
            </h2>

            <p className="
              text-zinc-400
              mt-3
            ">
              Todavía no existen locales registrados para esta categoría.
            </p>

          </div>
        )}

        {localesFiltrados.map((local) => {
          const imagen =
            local.fotos?.[0] ||
            "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee";

          return (
            <div
              key={local._id}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden hover:border-orange-500 hover:-translate-y-1 transition"
            >
              <div
                className="h-52 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${imagen})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                <div className="absolute bottom-4 left-4">
                  <h2 className="text-2xl font-black">{local.nombre}</h2>
                  <span className="inline-block mt-2 bg-orange-500/80 px-3 py-1 rounded-full text-sm font-bold">
                    {local.categoria}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <p className="text-zinc-400 line-clamp-3">
                  {local.descripcion}
                </p>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-zinc-800 rounded-2xl p-4">
                    <p className="text-zinc-400 text-sm">Precio</p>
                    <h3 className="font-bold">Q{local.precioPromedio}</h3>
                  </div>

                  <div className="bg-zinc-800 rounded-2xl p-4">
                    <p className="text-zinc-400 text-sm">Rating</p>
                    <h3 className="font-bold">{local.rating || 0}/5</h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <span className="text-yellow-400 text-xl">
                    ⭐
                  </span>

                  <span className="font-bold">
                    {(local.rating || 0).toFixed(2)}
                  </span>

                  <span className="text-zinc-500 text-sm">
                    ({local.totalResenas || 0} reseñas)
                  </span>
                </div>

                <div className="flex gap-2 mt-4">
                  {[1, 2, 3, 4, 5].map((valor) => (
                    <button
                      key={valor}
                      onClick={async () => {
                        try {
                          await api.put(
                            `/locales/${local._id}/valorar`,
                            { valor }
                          );

                          toast.success(
                            "Gracias por calificar el local"
                          );

                          cargarLocales();

                        } catch (error) {
                          toast.error(
                            "Error al calificar"
                          );
                        }
                      }}
                      className="
                        text-2xl
                        hover:scale-110
                        transition
                      "
                    >
                      ⭐
                    </button>
                  ))}
                </div>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${local.ubicacion.lat},${local.ubicacion.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-center mt-6 bg-orange-500 hover:bg-orange-600 py-4 rounded-2xl font-bold transition"
                >
                  Ver ubicación
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
    </DashboardLayout>
  );
}

export default ExplorarLocales;