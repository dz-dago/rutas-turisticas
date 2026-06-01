import React, { useEffect, useState } from "react";
import api from "../api/api";
import toast from "react-hot-toast";
import DashboardLayout from "../components/DashboardLayout";

function GuiasTuristicos() {
  const [guias, setGuias] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarGuias = async () => {
    try {
      const res = await api.get("/guias");
      setGuias(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar guías");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarGuias();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white px-8 py-10">
        <div className="h-12 w-72 bg-zinc-800 rounded-2xl animate-pulse" />

        <div className="h-6 w-96 bg-zinc-900 rounded-xl mt-5 animate-pulse" />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-zinc-800 animate-pulse" />

                <div className="flex-1">
                  <div className="h-7 bg-zinc-800 rounded-xl animate-pulse" />
                  <div className="h-4 bg-zinc-800 rounded-xl mt-3 animate-pulse" />
                </div>
              </div>

              <div className="h-4 bg-zinc-800 rounded-xl mt-6 animate-pulse" />
              <div className="h-4 bg-zinc-800 rounded-xl mt-3 animate-pulse" />
              <div className="h-4 w-2/3 bg-zinc-800 rounded-xl mt-3 animate-pulse" />

              <div className="flex gap-2 mt-6">
                <div className="h-8 w-20 bg-zinc-800 rounded-full animate-pulse" />
                <div className="h-8 w-20 bg-zinc-800 rounded-full animate-pulse" />
                <div className="h-8 w-20 bg-zinc-800 rounded-full animate-pulse" />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="h-20 bg-zinc-800 rounded-2xl animate-pulse" />
                <div className="h-20 bg-zinc-800 rounded-2xl animate-pulse" />
              </div>

              <div className="flex gap-3 mt-6">
                <div className="h-12 flex-1 bg-zinc-800 rounded-2xl animate-pulse" />
                <div className="h-12 flex-1 bg-zinc-800 rounded-2xl animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-zinc-950 text-white px-8 py-10">
      <h1 className="text-4xl font-black text-orange-400">
        Guías Turísticos
      </h1>

      <p className="text-zinc-400 mt-3 max-w-2xl">
        Contacta guías locales para rutas culturales, históricas y experiencias personalizadas.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-10">
        {guias.length === 0 && (
          <div className="col-span-full bg-zinc-900 border border-zinc-800 rounded-3xl p-10 text-center">
            <div className="text-6xl mb-5">🧭</div>

            <h2 className="text-3xl font-black">
              No hay guías turísticos disponibles
            </h2>

            <p className="text-zinc-400 mt-3">
              Cuando existan guías registrados aparecerán en esta sección.
            </p>
          </div>
        )}

        {guias.map((guia) => {
          const usuario = guia.usuarioId;
          const telefono = guia.telefono || usuario?.telefono;
          const foto = guia.fotoPerfil || usuario?.avatar;

          const registrarContacto = async (tipo) => {
            try {
              await api.put(`/guias/${guia._id}/registrar-contacto`);

              if (tipo === "whatsapp" && telefono) {
                window.open(`https://wa.me/502${telefono}`, "_blank");
              }

              if (tipo === "email" && usuario?.email) {
                window.location.href = `mailto:${usuario.email}`;
              }
            } catch (error) {
              toast.error("Error al registrar contacto");
            }
          };

          return (
            <div
              key={guia._id}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-orange-500 transition"
            >
              <div className="flex items-center gap-4">
                <img
                  src={
                    foto ||
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
                  }
                  alt={usuario?.nombre || "Guía turístico"}
                  className="w-16 h-16 rounded-full object-cover border-2 border-orange-500"
                />

                <div>
                  <h2 className="text-2xl font-bold">
                    {usuario?.nombre || "Guía turístico"}
                  </h2>

                  <p className="text-zinc-400">
                    {guia.experiencia || "Experiencia no especificada"}
                  </p>
                </div>
              </div>

              <p className="text-zinc-300 mt-5">
                {guia.descripcion}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {guia.idiomas?.map((idioma) => (
                  <span
                    key={idioma}
                    className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-sm"
                  >
                    {idioma}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-zinc-800 rounded-2xl p-4">
                  <p className="text-zinc-400 text-sm">Precio</p>
                  <h3 className="font-bold">Q{guia.precioPromedio}</h3>
                </div>

                <div className="bg-zinc-800 rounded-2xl p-4">
                  <p className="text-zinc-400 text-sm">Rating</p>
                  <h3 className="font-bold">{guia.rating || 0}/5</h3>
                </div>
              </div>

              <div className="mt-5">
                <p className="text-zinc-400 text-sm mb-2">
                  Calificar guía
                </p>

                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((valor) => (
                    <button
                      key={valor}
                      onClick={async () => {
                        try {
                          await api.put(`/guias/${guia._id}/valorar`, {
                            valor
                          });

                          toast.success("Gracias por calificar al guía");
                          cargarGuias();
                        } catch (error) {
                          toast.error("Error al calificar guía");
                        }
                      }}
                      className="text-2xl hover:scale-110 transition"
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                {telefono && (
                  <button
                    onClick={() => registrarContacto("whatsapp")}
                    className="flex-1 text-center bg-green-600 hover:bg-green-700 py-3 rounded-2xl font-bold transition"
                  >
                    WhatsApp
                  </button>
                )}

                {usuario?.email && (
                  <button
                    onClick={() => registrarContacto("email")}
                    className="flex-1 text-center bg-orange-500 hover:bg-orange-600 py-3 rounded-2xl font-bold transition"
                  >
                    Email
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
    </DashboardLayout>
  );
}

export default GuiasTuristicos;