import React from "react";
import { useAuth } from "../context/AuthContext";

function Perfil() {
  const { usuario, logout } = useAuth();

  if (!usuario) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <h1 className="text-3xl font-bold">Cargando perfil...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-8 py-10">
      <h1 className="text-4xl font-black text-orange-400">
        Mi Perfil
      </h1>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 mt-8 max-w-3xl">
        <div className="flex items-center gap-5">
          <img
            src={
              usuario.avatar ||
              "https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
            }
            alt={usuario.nombre}
            className="w-24 h-24 rounded-full object-cover border-2 border-orange-500"
          />

          <div>
            <h2 className="text-3xl font-bold">{usuario.nombre}</h2>
            <p className="text-zinc-400">{usuario.email}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5 mt-8">
          <div className="bg-zinc-800 rounded-2xl p-5">
            <p className="text-zinc-400 text-sm">Rol</p>
            <h3 className="font-bold">{usuario.rol}</h3>
          </div>

          <div className="bg-zinc-800 rounded-2xl p-5">
            <p className="text-zinc-400 text-sm">Perfil turístico</p>
            <h3 className="font-bold">{usuario.perfilTipo || "No definido"}</h3>
          </div>

          <div className="bg-zinc-800 rounded-2xl p-5">
            <p className="text-zinc-400 text-sm">Teléfono</p>
            <h3 className="font-bold">{usuario.telefono || "No registrado"}</h3>
          </div>

          <div className="bg-zinc-800 rounded-2xl p-5">
            <p className="text-zinc-400 text-sm">Nacionalidad</p>
            <h3 className="font-bold">{usuario.nacionalidad}</h3>
          </div>

          <div className="bg-zinc-800 rounded-2xl p-5">
            <p className="text-zinc-400 text-sm">Confianza</p>
            <h3 className="font-bold">{usuario.confianza || 0}</h3>
          </div>

          <div className="bg-zinc-800 rounded-2xl p-5">
            <p className="text-zinc-400 text-sm">Estado</p>
            <h3 className="font-bold">{usuario.estado}</h3>
          </div>
        </div>

        <button
          onClick={logout}
          className="mt-8 bg-red-600 hover:bg-red-700 px-6 py-4 rounded-2xl font-bold transition"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export default Perfil;