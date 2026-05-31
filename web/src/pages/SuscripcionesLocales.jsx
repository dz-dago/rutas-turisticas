import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

import api from "../api/api";
import DashboardLayout from "../components/DashboardLayout";
import { PRECIO_SUSCRIPCION } from "../constants/suscripcion";

function SuscripcionesLocales() {
  const [locales, setLocales] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarLocales = async () => {
    try {
      const res = await api.get("/locales/mis-locales");
      setLocales(res.data);
    } catch (error) {
      toast.error("Error al cargar locales");
    } finally {
      setLoading(false);
    }
  };

  const activarSuscripcion = async (id) => {
    try {
      const loadingToast = toast.loading("Activando suscripción...");

      await api.put(`/locales/mis-locales/${id}/activar-suscripcion`);

      toast.dismiss(loadingToast);
      toast.success("Suscripción activada");

      cargarLocales();
    } catch (error) {
      toast.error("Error al activar suscripción");
    }
  };

  useEffect(() => {
    cargarLocales();
  }, []);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-zinc-950 text-white px-5 md:px-8 py-10">
        <h1 className="text-4xl font-black">
          Suscripciones de locales
        </h1>

        <p className="text-zinc-400 mt-3">
          Cada local necesita una suscripción activa para aparecer públicamente.
        </p>

        {loading && (
          <p className="text-zinc-400 mt-10">
            Cargando suscripciones...
          </p>
        )}

        {!loading && locales.length === 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-10 mt-10 text-center">
            <div className="text-6xl mb-5">💳</div>

            <h2 className="text-3xl font-black">
              No hay locales para suscribir
            </h2>

            <p className="text-zinc-400 mt-3">
              Primero agrega un local para activar su visibilidad.
            </p>
          </div>
        )}

        <div className="grid xl:grid-cols-2 gap-8 mt-10">
          {locales.map((local) => (
            <div
              key={local._id}
              className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-7"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-black">
                    {local.nombre}
                  </h2>

                  <p className="text-zinc-400 mt-2">
                    {local.ubicacion?.direccion}
                  </p>
                </div>

                <span
                  className={`px-4 py-2 rounded-full text-sm font-bold ${
                    local.suscripcionActiva
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {local.suscripcionActiva ? "Visible" : "Oculto"}
                </span>
              </div>

              <div className="bg-zinc-800 rounded-3xl p-6 mt-6">
                <p className="text-zinc-400">
                  Suscripción mensual
                </p>

                <h3 className="text-5xl font-black mt-3">
                  Q{PRECIO_SUSCRIPCION}
                </h3>

                <p className="text-zinc-400 mt-2">
                  Visibilidad pública del local dentro de la plataforma.
                </p>
              </div>

              {!local.suscripcionActiva ? (
                <button
                  onClick={() => activarSuscripcion(local._id)}
                  className="w-full bg-orange-500 hover:bg-orange-600 py-5 rounded-2xl font-bold transition mt-6"
                >
                  Activar suscripción
                </button>
              ) : (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl p-5 mt-6">
                  Este local ya aparece públicamente para los turistas.
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default SuscripcionesLocales;
