import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../api/api";

function Registro() {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "turista",

    telefono: "",
    nacionalidad: "Guatemala",

    perfilTipo: "TUR",

    avatar: "",

    documentoIdentidad: "",

    fotoPerfil: "",
    credencialIdentificacion: "",
    idiomas: "",
    descripcion: "",
    experiencia: "",
    rutasOfrecidas: "",
    precioPromedio: "",

    nombreLocal: "",
    categoriaLocal: "",
    direccionLocal: "",
    fotoLocal: "",
    documentoLocal: ""
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

      console.error(error);

      toast.error(
        "Error al subir imagen"
      );

      return "";
    }
  };

  const registrar = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const loadingToast = toast.loading(
        "Creando cuenta..."
      );

      const payload = {
        ...form,
        idiomas: form.idiomas
          ? form.idiomas.split(",").map((i) => i.trim())
          : [],
        rutasOfrecidas: form.rutasOfrecidas
          ? form.rutasOfrecidas.split(",").map((r) => r.trim())
          : [],
        precioPromedio: Number(form.precioPromedio) || 0
      };

      const res = await api.post(
        "/auth/registro",
        payload
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      toast.dismiss(loadingToast);

      toast.success(
        "Cuenta creada correctamente"
      );

      const rol = res.data.usuario.rol;
      console.log("ROL REGISTRADO:", rol);

      if (rol === "propietario") {
        navigate("/propietario");
      } else if (rol === "guia") {
        navigate("/guia");
      } else {
        navigate("/turista");
      }

    } catch (error) {

      console.error(error);

      toast.error(
        error.response?.data?.mensaje ||
        "Error al crear cuenta"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="
      min-h-screen
      bg-zinc-950
      text-white
      flex
      items-center
      justify-center
      px-6
      py-12
    ">

      <div className="
        w-full
        max-w-xl
        bg-zinc-900
        border
        border-zinc-800
        rounded-[2rem]
        p-8
      ">

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700"
        >
          ← Regresar
        </button>

        <h1 className="
          text-4xl
          font-black
        ">
          Crear cuenta
        </h1>

        <p className="
          text-zinc-400
          mt-3
        ">
          Registra una nueva cuenta para acceder a la plataforma.
        </p>

        <form
          onSubmit={registrar}
          className="space-y-5 mt-8"
        >

          <input
            type="text"
            name="nombre"
            placeholder="Nombre completo"
            value={form.nombre}
            onChange={handleChange}
            required
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
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            required
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
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            required
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

          <div>

            <label className="block mb-2 text-zinc-300">
              Foto de perfil
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {

                const archivo = e.target.files[0];

                if (!archivo) return;

                const loadingToast = toast.loading(
                  "Subiendo imagen..."
                );

                const url = await subirImagen(
                  archivo
                );

                toast.dismiss(loadingToast);

                if (url) {

                  setForm({
                    ...form,
                    avatar: url
                  });

                  toast.success(
                    "Imagen subida"
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
              form.avatar && (

                <img
                  src={form.avatar}
                  alt="avatar"
                  className="
                    w-24
                    h-24
                    rounded-full
                    object-cover
                    mt-4
                  "
                />
              )
            }

          </div>

          <select
            name="rol"
            value={form.rol}
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
          >

            <option value="turista">
              Turista
            </option>

            <option value="guia">
              Guía turístico
            </option>

            <option value="propietario">
              Propietario
            </option>

          </select>

          {
            form.rol === "turista" && (

              <select
                name="perfilTipo"
                value={form.perfilTipo}
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
              >

                <option value="TUR">
                  Turista general
                </option>

                <option value="FAM">
                  Familia
                </option>

                <option value="PAR">
                  Pareja
                </option>

                <option value="SOL">
                  Solo
                </option>

                <option value="GRP">
                  Grupo
                </option>

              </select>
            )
          }

          {
            form.rol === "guia" && (
              <div className="space-y-5">

                <input
                  type="text"
                  name="telefono"
                  placeholder="Número de teléfono"
                  value={form.telefono}
                  onChange={handleChange}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4"
                />

                <div>
                  <label className="block mb-2 text-zinc-300">
                    Foto de perfil
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const archivo = e.target.files[0];
                      if (!archivo) return;

                      const loadingToast = toast.loading("Subiendo foto...");

                      const url = await subirImagen(archivo);

                      toast.dismiss(loadingToast);

                      if (url) {
                        setForm({
                          ...form,
                          fotoPerfil: url
                        });

                        toast.success("Foto subida");
                      }
                    }}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4"
                  />

                  {form.fotoPerfil && (
                    <img
                      src={form.fotoPerfil}
                      alt="Foto perfil"
                      className="w-24 h-24 rounded-full object-cover mt-4"
                    />
                  )}
                </div>

                <div>
                  <label className="block mb-2 text-zinc-300">
                    Credencial de identificación
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const archivo = e.target.files[0];
                      if (!archivo) return;

                      const loadingToast = toast.loading("Subiendo credencial...");

                      const url = await subirImagen(archivo);

                      toast.dismiss(loadingToast);

                      if (url) {
                        setForm({
                          ...form,
                          credencialIdentificacion: url
                        });

                        toast.success("Credencial subida");
                      }
                    }}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4"
                  />

                  {form.credencialIdentificacion && (
                    <img
                      src={form.credencialIdentificacion}
                      alt="Credencial"
                      className="w-full max-h-56 rounded-2xl object-cover mt-4"
                    />
                  )}
                </div>

                <input
                  type="text"
                  name="idiomas"
                  placeholder="Idiomas separados por coma. Ej: Español, Inglés"
                  value={form.idiomas}
                  onChange={handleChange}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4"
                />

                <input
                  type="text"
                  name="experiencia"
                  placeholder="Experiencia. Ej: 3 años"
                  value={form.experiencia}
                  onChange={handleChange}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4"
                />

                <textarea
                  name="descripcion"
                  placeholder="Descripción profesional"
                  value={form.descripcion}
                  onChange={handleChange}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 min-h-[120px]"
                />

                <input
                  type="text"
                  name="rutasOfrecidas"
                  placeholder="Rutas ofrecidas separadas por coma"
                  value={form.rutasOfrecidas}
                  onChange={handleChange}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4"
                />

                <input
                  type="number"
                  name="precioPromedio"
                  placeholder="Precio promedio"
                  value={form.precioPromedio}
                  onChange={handleChange}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4"
                />

              </div>
            )
          }

          {
            form.rol === "propietario" && (
              <div className="space-y-5">
                <input
                  type="text"
                  name="telefono"
                  placeholder="Número de teléfono"
                  value={form.telefono}
                  onChange={handleChange}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4"
                />

                <div>
                  <label className="block mb-2 text-zinc-300">
                    Documento de identificación
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const archivo = e.target.files[0];

                      if (!archivo) return;

                      const loadingToast = toast.loading("Subiendo documento...");

                      const url = await subirImagen(archivo);

                      toast.dismiss(loadingToast);

                      if (url) {
                        setForm({
                          ...form,
                          documentoIdentidad: url
                        });

                        toast.success("Documento subido");
                      }
                    }}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4"
                  />

                  {form.documentoIdentidad && (
                    <img
                      src={form.documentoIdentidad}
                      alt="documento"
                      className="w-24 h-24 rounded-full object-cover mt-4"
                    />
                  )}
                </div>
              </div>
            )
          }

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              bg-orange-500
              hover:bg-orange-600
              py-4
              rounded-2xl
              font-bold
              transition
            "
          >

            {
              loading
                ? "Creando cuenta..."
                : "Crear cuenta"
            }

          </button>

        </form>

        <p className="
          text-zinc-400
          text-center
          mt-8
        ">

          ¿Ya tienes cuenta?

          <Link
            to="/login"
            className="
              text-orange-400
              ml-2
              font-bold
            "
          >
            Iniciar sesión
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Registro;