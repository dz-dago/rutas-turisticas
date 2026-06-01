import React from "react";

import { useLocation } from "react-router-dom";

import DashboardLayout from "../components/DashboardLayout";

import MapaRuta from "../components/MapaRuta";
import BotonRegresar from "../components/BotonRegresar";

const categoriasMap = {
  CAF: "Cafeterías",
  GAS: "Gastronomía",
  NAT: "Naturaleza",
  CUL: "Cultura",
  ENT: "Entretenimiento",
  EXP: "Experiencias",
  HIS: "Histórico",
  REL: "Religioso"
};

function DetalleRuta() {

  const location = useLocation();

  let rutaGuardada = null;

  try {
    rutaGuardada = JSON.parse(
      localStorage.getItem("rutaSeleccionada")
    );
  } catch {
    rutaGuardada = null;
  }

  const ruta = location.state?.ruta || rutaGuardada;

  const rutaMapa = ruta?.lugares?.map((local, index) => ({
    orden: index + 1,
    categoria: local.categoria,
    local
  })) || [];

  const crearLinkLocalMaps = (local) => {
    const lat = local.ubicacion?.lat;
    const lng = local.ubicacion?.lng;

    if (!lat || !lng) return "#";

    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  };

  if (!ruta) {
    return (
      <DashboardLayout>
        <div className="text-white p-10">
          Ruta no encontrada
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
          max-w-6xl
          mx-auto
        ">

          <BotonRegresar />

          <div className="
bg-zinc-900
            border
border-zinc-800
            rounded-[2rem]
            p-8
          ">

            <div className="
              flex
              flex-wrap
              items-start
              justify-between
              gap-6
            ">

              <div>

                <span className="
                  inline-block
bg-orange-500
                  px-4
                  py-2
                  rounded-full
                  text-sm
                  font-bold
                  mb-5
                ">
                  {ruta.tipoRuta}
                </span>

                <h1 className="
                  text-5xl
                  font-black
                ">
                  {ruta.nombre}
                </h1>

                <p className="
                  text-zinc-400
                  mt-4
                  max-w-3xl
                ">
                  {ruta.descripcion}
                </p>

              </div>

              <a
                href={ruta.linkGoogleMaps}
                target="_blank"
                rel="noreferrer"
                className="
bg-orange-500
hover:bg-orange-600
                  px-6
                  py-4
                  rounded-2xl
                  font-bold
                  transition
                "
              >
                Abrir en Google Maps
              </a>

            </div>

            <div className="
              grid
              md:grid-cols-4
              gap-4
              mt-8
            ">

              <div className="
bg-zinc-800
                rounded-2xl
                p-5
              ">

<p className="text-zinc-400">
                  Duración
                </p>

                <h2 className="
                  text-2xl
                  font-black
                  mt-2
                ">
                  {ruta.duracionEstimada}
                </h2>

              </div>

              <div className="
bg-zinc-800
                rounded-2xl
                p-5
              ">

<p className="text-zinc-400">
                  Precio estimado
                </p>

                <h2 className="
                  text-2xl
                  font-black
                  mt-2
                ">
                  Q{ruta.precioEstimado}
                </h2>

              </div>

              <div className="
bg-zinc-800
                rounded-2xl
                p-5
              ">

<p className="text-zinc-400">
                  Rating promedio
                </p>

                <h2 className="
                  text-2xl
                  font-black
                  mt-2
                ">
                  ⭐ {ruta.ratingPromedio}
                </h2>

              </div>

              <div className="
bg-zinc-800
                rounded-2xl
                p-5
              ">

<p className="text-zinc-400">
                  Lugares
                </p>

                <h2 className="
                  text-2xl
                  font-black
                  mt-2
                ">
                  {ruta.lugares.length}
                </h2>

              </div>

            </div>

          </div>

          <div className="mt-10">

            <h2 className="
              text-4xl
              font-black
              mb-6
            ">
              Mapa interactivo
            </h2>

            <MapaRuta ruta={rutaMapa} />

          </div>

          <div className="mt-12">

            <h2 className="
              text-4xl
              font-black
              mb-8
            ">
              Lugares de la ruta
            </h2>

            <div className="
              grid
              xl:grid-cols-2
              gap-8
            ">

              {
                ruta.lugares.map((local, index) => (

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

                    <div className="p-6">

                      <div className="
                        flex
                        items-center
                        justify-between
                        gap-4
                      ">

                        <div>

                          <span className="
                            inline-block
          bg-orange-500
                            px-3
                            py-1
                            rounded-full
                            text-xs
                            font-bold
                            mb-3
                          ">

                            PARADA #{index + 1}

                          </span>

                          <h3 className="
                            text-3xl
                            font-black
                          ">
                            {local.nombre}
                          </h3>

                        </div>

                        <div className="
                          text-right
                        ">

                          <div className="
text-orange-400
                            text-xl
                            font-bold
                          ">
                            ⭐ {local.rating}
                          </div>

                          <div className="
  text-zinc-400
                            text-sm
                          ">
                            {local.totalResenas} reseñas
                          </div>

                        </div>

                      </div>

                      <div className="
                        flex
                        flex-wrap
                        gap-3
                        mt-4
                      ">

                        <span className="
          bg-zinc-800
                          px-4
                          py-2
                          rounded-full
                          text-sm
                        ">

                          {
                            categoriasMap[
                              local.categoria
                            ]
                          }

                        </span>

                        <span className="
          bg-zinc-800
                          px-4
                          py-2
                          rounded-full
                          text-sm
                        ">

                          Q{local.precioPromedio}
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
        bg-zinc-800
                        rounded-2xl
                        p-4
                        mt-5
                      ">

                        <p className="
text-zinc-400
                          text-sm
                        ">
                          Ubicación
                        </p>

                        <h4 className="
                          font-bold
                          mt-1
                        ">
                          {
                            local.ubicacion?.direccion
                          }
                        </h4>

                      </div>

                      <a
                        href={crearLinkLocalMaps(local)}
                        target="_blank"
                        rel="noreferrer"
                        className="
                          block
                          text-center
                          mt-5
          bg-zinc-800
hover:bg-zinc-700
                          py-4
                          rounded-2xl
                          font-bold
                          transition
                        "
                      >
                        Ver local en Google Maps
                      </a>

                    </div>

                  </div>
                ))
              }

            </div>

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default DetalleRuta;