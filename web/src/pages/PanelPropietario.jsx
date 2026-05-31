import React from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";

function PanelPropietario() {
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-zinc-950 text-white px-5 md:px-8 py-10">
        <h1 className="text-4xl font-black">
          Panel de propietario
        </h1>

        <p className="text-zinc-400 mt-3">
          Administra tus locales, revisa su visibilidad y controla sus suscripciones.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-10">
          <Link
            to="/propietario/agregar-local"
            className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-orange-500 transition"
          >
            <div className="text-5xl mb-5">➕</div>
            <h2 className="text-2xl font-black">Agregar local</h2>
            <p className="text-zinc-400 mt-3">
              Registra un nuevo negocio dentro de la plataforma.
            </p>
          </Link>

          <Link
            to="/propietario/locales"
            className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-orange-500 transition"
          >
            <div className="text-5xl mb-5">📍</div>
            <h2 className="text-2xl font-black">Mis locales</h2>
            <p className="text-zinc-400 mt-3">
              Consulta los locales que has registrado.
            </p>
          </Link>

          <Link
            to="/propietario/suscripciones"
            className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-orange-500 transition"
          >
            <div className="text-5xl mb-5">💳</div>
            <h2 className="text-2xl font-black">Suscripciones</h2>
            <p className="text-zinc-400 mt-3">
              Activa la visibilidad pública de cada local.
            </p>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default PanelPropietario;
