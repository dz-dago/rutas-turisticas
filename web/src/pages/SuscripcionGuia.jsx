import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

import api from "../api/api";
import DashboardLayout from "../components/DashboardLayout";
import { PRECIO_SUSCRIPCION } from "../constants/suscripcion";

function SuscripcionGuia() {
  const [guia, setGuia] = useState(null);
  const [loading, setLoading] = useState(true);

  const cargarPerfil = async () => {
    try {
      const res = await api.get("/guias/mi-perfil");
      setGuia(res.data);
    } catch (error) {
      toast.error("Error al cargar suscripción");
    } finally {
      setLoading(false);
    }
  };

  const activarSuscripcion = async () => {
    const loadingToast = toast.loading("Activando suscripción...");

    try {
      const res = await api.put(
        "/guias/mi-perfil/activar-suscripcion"
      );

      setGuia(res.data.guia);

      toast.dismiss(loadingToast);
      toast.success("Suscripción activada");
    } catch (error) {
      toast.dismiss(loadingToast);

      console.error(error.response?.data || error);

      toast.error(
        error.response?.data?.mensaje ||
        "Error al activar suscripción"
      );
    }
  };

  useEffect(() => {
    cargarPerfil();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-zinc-950 px-8 py-10">
          <div className="h-12 w-80 bg-zinc-800 rounded-2xl animate-pulse" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-zinc-950 text-white px-5 md:px-8 py-10">
        <h1 className="text-4xl font-black">
          Suscripción
        </h1>

        <p className="text-zinc-400 mt-3">
          Controla la visibilidad pública de tu perfil como guía turístico.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mt-10">
          <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8">
            <h2 className="text-2xl font-black">
              Estado actual
            </h2>

            <div
              className={`mt-6 rounded-2xl p-6 border ${
                guia?.suscripcionActiva
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-red-500/10 border-red-500/30 text-red-400"
              }`}
            >
              <h3 className="text-2xl font-black">
                {guia?.suscripcionActiva
                  ? "Suscripción activa"
                  : "Suscripción inactiva"}
              </h3>

              <p className="mt-2">
                {guia?.suscripcionActiva
                  ? "Tu perfil aparece públicamente para los turistas."
                  : "Tu perfil no aparece en la app hasta activar la suscripción."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-zinc-800 rounded-2xl p-5">
                <p className="text-zinc-400 text-sm">
                  Rating
                </p>
                <h3 className="text-2xl font-bold">
                  {guia?.rating || 0}/5
                </h3>
              </div>

              <div className="bg-zinc-800 rounded-2xl p-5">
                <p className="text-zinc-400 text-sm">
                  Reseñas
                </p>
                <h3 className="text-2xl font-bold">
                  {guia?.totalResenas || 0}
                </h3>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8">
            <h2 className="text-2xl font-black">
              Plan de visibilidad
            </h2>

            <p className="text-zinc-400 mt-4">
              La suscripción permite que tu perfil sea visible para turistas dentro de la plataforma.
            </p>

            <div className="mt-8 bg-zinc-800 rounded-3xl p-6">
              <p className="text-zinc-400">
                Suscripción mensual
              </p>

              <h3 className="text-5xl font-black mt-3">
                Q{PRECIO_SUSCRIPCION}
              </h3>

              <p className="text-zinc-400 mt-2">
                acceso a visibilidad pública
              </p>
            </div>

            <button
              onClick={activarSuscripcion}
              className="w-full mt-8 bg-orange-500 hover:bg-orange-600 py-5 rounded-2xl font-bold transition"
            >
              Activar suscripción
            </button>

            <p className="text-zinc-500 text-sm mt-4">
              En esta versión el pago es representativo. La activación real puede realizarse desde administración.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default SuscripcionGuia;
