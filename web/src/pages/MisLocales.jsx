import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

import api from "../api/api";
import DashboardLayout from "../components/DashboardLayout";
import BotonRegresar from "../components/BotonRegresar";

const categoriasMap = {
  CAF: "Cafeterías y postres",
  CUL: "Turismo y cultura",
  EXP: "Experiencias y relax",
  GAS: "Gastronomía",
  ENT: "Entretenimiento y eventos",
  NAT: "Parques y naturaleza",
  HIS: "Historia",
  REL: "Religioso"
};

function MisLocales() {

  const [locales, setLocales] = useState([]);

  const [loading, setLoading] = useState(true);

  const cargarLocales = async () => {

    try {

      const res = await api.get(
        "/locales/mis-locales"
      );

      setLocales(res.data);

    } catch (error) {

      toast.error(
        "Error al cargar locales"
      );

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {
    cargarLocales();
  }, []);

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

        <BotonRegresar />

        <h1 className="
          text-4xl
          font-black
        ">
          Mis locales
        </h1>

        <p className="
          text-zinc-400
          mt-3
        ">
          Administra los locales registrados en la plataforma.
        </p>

        {
          loading && (

            <p className="
              text-zinc-400
              mt-10
            ">
              Cargando locales...
            </p>
          )
        }

        {
          !loading &&
          locales.length === 0 && (

            <div className="
              bg-zinc-900
              border
              border-zinc-800
              rounded-[2rem]
              p-10
              mt-10
              text-center
            ">

              <div className="
                text-6xl
                mb-5
              ">
                🏪
              </div>

              <h2 className="
                text-3xl
                font-black
              ">
                No tienes locales registrados
              </h2>

              <p className="
                text-zinc-400
                mt-3
              ">
                Agrega tu primer local desde el panel de propietario.
              </p>

            </div>
          )
        }

        <div className="
          grid
          xl:grid-cols-2
          gap-8
          mt-10
        ">

          {
            locales.map((local) => (

              <div
                key={local._id}
                className="
                  bg-zinc-900
                  border
                  border-zinc-800
                  rounded-[2rem]
                  overflow-hidden
                "
              >

                {
                  local.fotos?.[0] && (

                    <img
                      src={local.fotos[0]}
                      alt={local.nombre}
                      className="
                        w-full
                        h-64
                        object-cover
                      "
                    />
                  )
                }

                <div className="p-7">

                  <div className="
                    flex
                    items-start
                    justify-between
                    gap-4
                  ">

                    <div>

                      <h2 className="
                        text-3xl
                        font-black
                      ">
                        {local.nombre}
                      </h2>

                      <p className="
                        text-orange-400
                        mt-2
                      ">
                        {
                          categoriasMap[
                            local.categoria
                          ] || local.categoria
                        }
                      </p>

                    </div>

                    <span className={`
                      px-4
                      py-2
                      rounded-full
                      text-sm
                      font-bold
                      ${
                        local.suscripcionActiva
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-red-500/20 text-red-400"
                      }
                    `}>

                      {
                        local.suscripcionActiva
                          ? "Visible"
                          : "Oculto"
                      }

                    </span>

                  </div>

                  <p className="
                    text-zinc-400
                    mt-5
                    leading-relaxed
                  ">
                    {local.descripcion}
                  </p>

                  <div className="
                    grid
                    grid-cols-2
                    gap-4
                    mt-6
                  ">

                    <div className="
                      bg-zinc-800
                      rounded-2xl
                      p-4
                    ">

                      <p className="
                        text-zinc-500
                        text-sm
                      ">
                        Estado
                      </p>

                      <h3 className="
                        font-bold
                        mt-1
                      ">
                        {local.estado}
                      </h3>

                    </div>

                    <div className="
                      bg-zinc-800
                      rounded-2xl
                      p-4
                    ">

                      <p className="
                        text-zinc-500
                        text-sm
                      ">
                        Precio promedio
                      </p>

                      <h3 className="
                        font-bold
                        mt-1
                      ">
                        Q{local.precioPromedio || 0}
                      </h3>

                    </div>

                  </div>

                  <div className="
                    bg-zinc-800
                    rounded-2xl
                    p-4
                    mt-4
                  ">

                    <p className="
                      text-zinc-500
                      text-sm
                    ">
                      Dirección
                    </p>

                    <h3 className="
                      font-bold
                      mt-1
                    ">
                      {
                        local.ubicacion?.direccion
                      }
                    </h3>

                  </div>

                </div>

              </div>
            ))
          }

        </div>

      </div>

    </DashboardLayout>
  );
}

export default MisLocales;
