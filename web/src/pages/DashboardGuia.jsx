import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import DashboardLayout from "../components/DashboardLayout";

function DashboardGuia() {
  const [loading, setLoading] = useState(true);
  const [perfil, setPerfil] = useState(null);
  const [stats, setStats] = useState({
    totalReservas: 0,
    ratingPromedio: 0,
    totalResenas: 0
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const res = await api.get("/guias/mi-perfil");
      setPerfil(res.data);
      setStats({
        totalReservas: res.data.contactosGenerados || 0,
        ratingPromedio: res.data.rating || 0,
        totalResenas: res.data.totalResenas || 0
      });
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-zinc-950 text-white px-8 py-10">
          <div className="h-12 w-72 bg-zinc-800 rounded-2xl animate-pulse" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-zinc-950 text-white px-5 md:px-8 py-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-black">
              Panel de Guía
            </h1>
            <p className="text-zinc-400 mt-2">
              Gestiona tu perfil y servicios turísticos
            </p>
          </div>

          {/* Subscription Status */}
          {perfil && (
            <div className={`
              rounded-2xl
              p-5
              border
              mb-8
              ${
                perfil.suscripcionActiva
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-red-500/10 border-red-500/30 text-red-400"
              }
            `}>
              <h3 className="font-bold">
                {perfil.suscripcionActiva
                  ? "Suscripción activa"
                  : "Perfil oculto"}
              </h3>
              <p className="text-sm mt-1">
                {perfil.suscripcionActiva
                  ? "Tu perfil aparece públicamente para los turistas."
                  : "Tu perfil no aparece públicamente hasta activar la suscripción."}
              </p>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <p className="text-zinc-400 text-sm">Contactos generados</p>
              <h3 className="text-3xl font-bold mt-2">{stats.totalReservas}</h3>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <p className="text-zinc-400 text-sm">Rating promedio</p>
              <h3 className="text-3xl font-bold mt-2">{stats.ratingPromedio.toFixed(1)} ⭐</h3>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <p className="text-zinc-400 text-sm">Total de reseñas</p>
              <h3 className="text-3xl font-bold mt-2">{stats.totalResenas}</h3>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-6">Acciones rápidas</h2>
            
            <div className="grid grid-cols-1 gap-4">
              <Link
                to="/guia/perfil"
                className="bg-orange-500 hover:bg-orange-600 py-4 rounded-2xl font-bold transition text-center"
              >
                Editar perfil
              </Link>
            </div>
          </div>

          {/* Profile Preview */}
          {perfil && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mt-8">
              <h2 className="text-2xl font-bold mb-4">Vista previa del perfil</h2>
              
              <div className="flex items-start gap-6">
                {perfil.fotoPerfil && (
                  <img
                    src={perfil.fotoPerfil}
                    alt="Perfil"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                )}

                <div className="flex-1">
                  <h3 className="text-xl font-bold">{perfil.experiencia || "Sin experiencia especificada"}</h3>
                  <p className="text-zinc-400 mt-2">{perfil.descripcion || "Sin descripción"}</p>
                  
                  {perfil.idiomas && perfil.idiomas.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-zinc-400">Idiomas:</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {perfil.idiomas.map((idioma, index) => (
                          <span
                            key={index}
                            className="bg-zinc-800 px-3 py-1 rounded-full text-sm"
                          >
                            {idioma}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {perfil.precioPromedio > 0 && (
                    <p className="mt-4 text-lg font-bold">
                      Precio promedio: Q{perfil.precioPromedio}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default DashboardGuia;
