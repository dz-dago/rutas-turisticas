import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/api";
import logo from "../assets/logo.png";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const loginGoogle = () => {
    window.location.href = "https://rutas-turisticas-api.onrender.com/api/auth/google";
  };

  const loginManual = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const loadingToast = toast.loading("Iniciando sesión...");

      const res = await api.post("/auth/login", {
        email,
        password
      });

      localStorage.setItem("token", res.data.token);

      toast.dismiss(loadingToast);
      toast.success("Bienvenido");

      const rol = res.data.usuario.rol;

      if (rol === "propietario") {
        window.location.href = "/propietario";
      } else if (rol === "guia") {
        window.location.href = "/guia";
      } else {
        window.location.href = "/turista";
      }
    } catch (error) {
      toast.error(
        error.response?.data?.mensaje ||
        "Credenciales inválidas"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-transparent to-red-600/10 blur-3xl" />

      <div className="relative z-10 min-h-screen grid lg:grid-cols-2">
        <section className="hidden lg:flex flex-col justify-between p-12 border-r border-zinc-800">
          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <img
              src={logo}
              alt="Logo"
              className="w-12 h-12 object-contain"
            />

            <span className="text-2xl font-black text-orange-400">
              Rutas Turísticas
            </span>
          </Link>

          <div>
            <span className="bg-orange-500/20 text-orange-400 px-4 py-2 rounded-full font-semibold">
              Turismo inteligente
            </span>

            <h1 className="text-6xl font-black leading-tight mt-8">
              Explora Huehuetenango con rutas hechas para ti
            </h1>

            <p className="text-zinc-400 text-lg mt-6 max-w-xl">
              Accede para generar rutas inteligentes, descubrir locales y contactar guías turísticos.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
              <h3 className="text-3xl font-black text-orange-400">AI</h3>
              <p className="text-zinc-400 mt-2">Rutas inteligentes</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
              <h3 className="text-3xl font-black text-orange-400">GPS</h3>
              <p className="text-zinc-400 mt-2">Mapa interactivo</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
              <h3 className="text-3xl font-black text-orange-400">5★</h3>
              <p className="text-zinc-400 mt-2">Valoraciones</p>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-2xl">
            <div className="text-center">

              <img
                src={logo}
                alt="Rutas Turísticas"
                className="w-32 h-32 object-contain mx-auto mb-4"
              />

              <h2 className="text-4xl font-black">
                Iniciar sesión
              </h2>

              <p className="text-zinc-400 mt-3">
                Continúa con tu cuenta para acceder a tu panel turístico.
              </p>

            </div>

            <form onSubmit={loginManual} className="space-y-5 mt-8">
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 text-white"
              />

              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 text-white"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 py-4 rounded-2xl font-bold transition"
              >
                {loading ? "Ingresando..." : "Iniciar sesión"}
              </button>
            </form>

            <div className="my-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-zinc-800" />
              <span className="text-zinc-500 text-sm">o</span>
              <div className="h-px flex-1 bg-zinc-800" />
            </div>

            <button
              onClick={loginGoogle}
              className="w-full mt-8 bg-white text-zinc-950 hover:bg-zinc-200 py-4 rounded-2xl font-bold transition flex items-center justify-center gap-3"
            >
              <span className="text-xl">G</span>
              Continuar con Google
            </button>

            <div className="mt-6">
              <Link
                to="/registro"
                className="
                  w-full
                  block
                  text-center
                  bg-zinc-800
                  hover:bg-zinc-700
                  py-4
                  rounded-2xl
                  font-bold
                  transition
                "
              >
                Crear cuenta
              </Link>
            </div>

            <div className="flex items-center gap-4 my-8">
              <div className="h-px flex-1 bg-zinc-800" />
              <span className="text-zinc-500 text-sm">
                acceso seguro
              </span>
              <div  code  className="h-px flex-1 bg-zinc-800" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-900 rounded-2xl p-4">
                <p className="text-zinc-500 text-sm">Rutas</p>
                <h3 className="font-bold mt-1">Personalizadas</h3>
              </div>

              <div className="bg-zinc-900 rounded-2xl p-4">
                <p className="text-zinc-500 text-sm">Guías</p>
                <h3 className="font-bold mt-1">Locales</h3>
              </div>
            </div>

            <p className="text-zinc-500 text-sm text-center mt-8">
              Al continuar aceptas usar tu cuenta de Google para crear o acceder a tu perfil.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Login;