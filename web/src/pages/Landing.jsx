import React from "react";
import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-hidden">
      <section className="relative px-6 md:px-16 py-10">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-transparent to-red-500/10 blur-3xl" />

        <div className="
  relative
  z-10
  flex
  items-center
  min-h-[90vh]
">
          <div>
            <span className="inline-block bg-orange-500/20 text-orange-400 px-4 py-2 rounded-full font-semibold mb-6">
              Rutas inteligentes personalizadas
            </span>

            <h2 className="text-5xl md:text-7xl font-black leading-tight">
              Explora nuevas experiencias de forma inteligente
            </h2>

            <p className="text-zinc-400 text-lg mt-6 max-w-xl">
              Descubre rutas, lugares y experiencias organizadas automáticamente según tus preferencias.
            </p>

            <div className="flex flex-wrap gap-4 mt-10">
              <Link
                to="/login"
                className="bg-orange-500 hover:bg-orange-600 px-7 py-4 rounded-2xl font-bold transition"
              >
                Empezar
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}

export default Landing;