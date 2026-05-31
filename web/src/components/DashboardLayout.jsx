import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function DashboardLayout({ children }) {
  const { usuario, logout } = useAuth();
  const location = useLocation();
  const [menuMovil, setMenuMovil] = useState(false);

  const linksPorRol = {
    turista: [
      { path: "/turista", label: "Inicio", icon: "🏠" },
      { path: "/explorar-locales", label: "Locales", icon: "📍" },
      { path: "/guias-turisticos", label: "Guías", icon: "🧭" },
      { path: "/perfil", label: "Perfil", icon: "👤" }
    ],

    guia: [
      { path: "/guia", label: "Panel", icon: "📊" },
      { path: "/guia/perfil", label: "Editar perfil", icon: "👤" },
      { path: "/guia/suscripcion", label: "Suscripción", icon: "💳" }
    ],

    propietario: [
      { path: "/propietario", label: "Panel", icon: "🏪" },
      { path: "/propietario/agregar-local", label: "Agregar local", icon: "➕" },
      { path: "/propietario/locales", label: "Mis locales", icon: "📍" },
      { path: "/propietario/suscripciones", label: "Suscripciones", icon: "💳" },
      { path: "/perfil", label: "Perfil", icon: "👤" }
    ],

    admin: [
      { path: "/admin", label: "Eventos", icon: "🎉" },
      { path: "/turista", label: "Ver inicio", icon: "🏠" }
    ]
  };

  // Fallback a turista si el rol no está mapeado
  const links = linksPorRol[usuario?.rol] ?? linksPorRol.turista;

  // Badge de rol legible
  const badgeRol = {
    turista: "Turista",
    guia: "Guía",
    propietario: "Propietario",
    admin: "Administrador"
  }[usuario?.rol] ?? "Usuario";

  const badgeColor = {
    turista: "text-zinc-400",
    guia: "text-blue-400",
    propietario: "text-green-400",
    admin: "text-orange-400"
  }[usuario?.rol] ?? "text-zinc-400";

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div>
        <h1 className="text-2xl font-black text-orange-400">Rutas Turísticas</h1>
        <p className="text-zinc-500 text-sm mt-1">Huehuetenango</p>
      </div>

      {/* Nav */}
      <nav className="mt-10 space-y-2 flex-1">
        {links.map((link) => {
          const activo = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMenuMovil(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition font-semibold ${
                activo
                  ? "bg-orange-500 text-white"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Usuario card */}
      <div className="mt-auto bg-zinc-800 rounded-3xl p-4">
        <div className="flex items-center gap-3">
          <img
            src={
              usuario?.avatar ||
              usuario?.fotoPerfil ||
              "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80"
            }
            alt={usuario?.nombre || "Usuario"}
            className="w-12 h-12 rounded-full object-cover flex-shrink-0"
          />
          <div className="min-w-0">
            <h3 className="font-bold truncate text-white">
              {usuario?.nombre || "Usuario"}
            </h3>
            <p className={`text-sm font-medium ${badgeColor}`}>
              {badgeRol}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full mt-4 bg-red-600 hover:bg-red-700 py-3 rounded-2xl font-bold transition text-white"
        >
          Cerrar sesión
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">

      {/* Sidebar desktop */}
      <aside className="w-72 bg-zinc-900 border-r border-zinc-800 p-6 hidden lg:flex flex-col">
        <SidebarContent />
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">

        {/* Topbar móvil */}
        <div className="lg:hidden flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-zinc-900 sticky top-0 z-30">
          <h1 className="text-xl font-black text-orange-400">Rutas Turísticas</h1>
          <button
            onClick={() => setMenuMovil(!menuMovil)}
            className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-xl transition"
          >
            {menuMovil ? "✕" : "☰"}
          </button>
        </div>

        {/* Menú móvil desplegable */}
        {menuMovil && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMenuMovil(false)}
            />
            {/* Panel lateral */}
            <aside className="relative z-50 w-72 bg-zinc-900 border-r border-zinc-800 p-6 flex flex-col h-full overflow-y-auto">
              <SidebarContent />
            </aside>
          </div>
        )}

        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;
