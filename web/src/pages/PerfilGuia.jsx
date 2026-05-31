import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

import api from "../api/api";

import DashboardLayout from "../components/DashboardLayout";

function PerfilGuia() {

  const [loading, setLoading] = useState(true);

  const [guardando, setGuardando] = useState(false);

  const [form, setForm] = useState({
    telefono: "",
    fotoPerfil: "",
    credencialIdentificacion: "",
    idiomas: "",
    descripcion: "",
    experiencia: "",
    rutasOfrecidas: "",
    precioPromedio: "",
    suscripcionActiva: false
  });

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const subirImagen = async (archivo) => {

    try {

      const formData = new FormData();

      formData.append(
        "imagen",
        archivo
      );

      const res = await api.post(
        "/upload/imagen",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      return res.data.url;

    } catch (error) {

      toast.error(
        "Error al subir imagen"
      );

      return "";
    }
  };

  const cargarPerfil = async () => {

    try {

      const res = await api.get(
        "/guias/mi-perfil"
      );

      const guia = res.data;

      setForm({
        telefono: guia.telefono || "",
        fotoPerfil: guia.fotoPerfil || "",
        credencialIdentificacion:
          guia.credencialIdentificacion || "",

        idiomas:
          guia.idiomas?.join(", ") || "",

        descripcion:
          guia.descripcion || "",

        experiencia:
          guia.experiencia || "",

        rutasOfrecidas:
          guia.rutasOfrecidas?.join(", ") || "",

        precioPromedio:
          guia.precioPromedio || "",

        suscripcionActiva: guia.suscripcionActiva || false
      });

    } catch (error) {

      toast.error(
        "Error al cargar perfil"
      );

    } finally {

      setLoading(false);
    }
  };

  const guardarPerfil = async (e) => {

    e.preventDefault();

    try {

      setGuardando(true);

      const loadingToast = toast.loading(
        "Guardando perfil..."
      );

      await api.put(
        "/guias/mi-perfil",
        {
          ...form,

          idiomas:
            form.idiomas
              .split(",")
              .map((i) => i.trim()),

          rutasOfrecidas:
            form.rutasOfrecidas
              .split(",")
              .map((r) => r.trim()),

          precioPromedio:
            Number(form.precioPromedio) || 0
        }
      );

      toast.dismiss(loadingToast);

      toast.success(
        "Perfil actualizado"
      );

    } catch (error) {
      console.error("ERROR GUARDAR PERFIL:", error.response?.data || error);

      toast.error(
        error.response?.data?.mensaje ||
        error.response?.data?.error ||
        "Error al guardar perfil"
      );

    } finally {

      setGuardando(false);
    }
  };

  useEffect(() => {
    cargarPerfil();
  }, []);

  if (loading) {

    return (

      <DashboardLayout>

        <div className="
          min-h-screen
          bg-zinc-950
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

        </div>

      </DashboardLayout>
    );
  }

  return (

    <DashboardLayout>

      <div className="
        min-h-screen
        bg-zinc-950
        text-white
        px-5
        md:px-8
        py-10
      ">

        <div className="
          max-w-5xl
          mx-auto
        ">

          <div className="
            bg-zinc-900
            border
            border-zinc-800
            rounded-[2rem]
            p-8
          ">

            <h1 className="
              text-4xl
              font-black
            ">
              Perfil de guía
            </h1>

            <p className="
              text-zinc-400
              mt-3
            ">
              Administra tu información profesional.
            </p>

            <div className={`
              mt-6
              rounded-2xl
              p-5
              border
              ${
                form.suscripcionActiva
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-red-500/10 border-red-500/30 text-red-400"
              }
            `}>
              <h3 className="font-bold">
                {form.suscripcionActiva
                  ? "Suscripción activa"
                  : "Perfil oculto"}
              </h3>

              <p className="text-sm mt-1">
                {form.suscripcionActiva
                  ? "Tu perfil aparece públicamente para los turistas."
                  : "Tu perfil no aparece públicamente hasta activar la suscripción."}
              </p>
            </div>

            <form
              onSubmit={guardarPerfil}
              className="
                grid
                md:grid-cols-2
                gap-6
                mt-10
              "
            >

              <div className="space-y-6">

                <input
                  type="text"
                  name="telefono"
                  placeholder="Número de teléfono"
                  value={form.telefono}
                  onChange={handleChange}
                  className="
                    w-full
                    bg-zinc-800
                    border
                    border-zinc-700
                    rounded-2xl
                    px-5
                    py-4
                  "
                />

                <input
                  type="text"
                  name="experiencia"
                  placeholder="Experiencia"
                  value={form.experiencia}
                  onChange={handleChange}
                  className="
                    w-full
                    bg-zinc-800
                    border
                    border-zinc-700
                    rounded-2xl
                    px-5
                    py-4
                  "
                />

                <input
                  type="text"
                  name="idiomas"
                  placeholder="Idiomas separados por coma"
                  value={form.idiomas}
                  onChange={handleChange}
                  className="
                    w-full
                    bg-zinc-800
                    border
                    border-zinc-700
                    rounded-2xl
                    px-5
                    py-4
                  "
                />

                <input
                  type="text"
                  name="rutasOfrecidas"
                  placeholder="Rutas ofrecidas separadas por coma"
                  value={form.rutasOfrecidas}
                  onChange={handleChange}
                  className="
                    w-full
                    bg-zinc-800
                    border
                    border-zinc-700
                    rounded-2xl
                    px-5
                    py-4
                  "
                />

                <input
                  type="number"
                  name="precioPromedio"
                  placeholder="Precio promedio"
                  value={form.precioPromedio}
                  onChange={handleChange}
                  className="
                    w-full
                    bg-zinc-800
                    border
                    border-zinc-700
                    rounded-2xl
                    px-5
                    py-4
                  "
                />

              </div>

              <div className="space-y-6">

                <textarea
                  name="descripcion"
                  placeholder="Descripción profesional"
                  value={form.descripcion}
                  onChange={handleChange}
                  className="
                    w-full
                    min-h-[180px]
                    bg-zinc-800
                    border
                    border-zinc-700
                    rounded-2xl
                    px-5
                    py-4
                  "
                />

                <div>

                  <label className="
                    block
                    mb-2
                    text-zinc-300
                  ">
                    Foto de perfil
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {

                      const archivo =
                        e.target.files[0];

                      if (!archivo) return;

                      const loadingToast =
                        toast.loading(
                          "Subiendo foto..."
                        );

                      const url =
                        await subirImagen(
                          archivo
                        );

                      toast.dismiss(
                        loadingToast
                      );

                      if (url) {

                        setForm({
                          ...form,
                          fotoPerfil: url
                        });

                        toast.success(
                          "Foto subida"
                        );
                      }
                    }}
                    className="
                      w-full
                      bg-zinc-800
                      border
                      border-zinc-700
                      rounded-2xl
                      px-5
                      py-4
                    "
                  />

                  {
                    form.fotoPerfil && (

                      <img
                        src={form.fotoPerfil}
                        alt="perfil"
                        className="
                          w-32
                          h-32
                          rounded-full
                          object-cover
                          mt-5
                        "
                      />
                    )
                  }

                </div>

                <div>

                  <label className="
                    block
                    mb-2
                    text-zinc-300
                  ">
                    Credencial de identificación
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {

                      const archivo =
                        e.target.files[0];

                      if (!archivo) return;

                      const loadingToast =
                        toast.loading(
                          "Subiendo credencial..."
                        );

                      const url =
                        await subirImagen(
                          archivo
                        );

                      toast.dismiss(
                        loadingToast
                      );

                      if (url) {

                        setForm({
                          ...form,
                          credencialIdentificacion: url
                        });

                        toast.success(
                          "Credencial subida"
                        );
                      }
                    }}
                    className="
                      w-full
                      bg-zinc-800
                      border
                      border-zinc-700
                      rounded-2xl
                      px-5
                      py-4
                    "
                  />

                  {
                    form.credencialIdentificacion && (

                      <img
                        src={
                          form.credencialIdentificacion
                        }
                        alt="credencial"
                        className="
                          w-full
                          rounded-2xl
                          mt-5
                        "
                      />
                    )
                  }

                </div>

              </div>

              <div className="md:col-span-2">

                <button
                  type="submit"
                  disabled={guardando}
                  className="
                    w-full
                    bg-orange-500
                    hover:bg-orange-600
                    py-5
                    rounded-2xl
                    font-bold
                    transition
                  "
                >

                  {
                    guardando
                      ? "Guardando..."
                      : "Guardar cambios"
                  }

                </button>

              </div>

            </form>

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default PerfilGuia;
