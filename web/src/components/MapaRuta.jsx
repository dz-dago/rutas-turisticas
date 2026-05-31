import React from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline
} from "react-leaflet";

import L from "leaflet";

const crearIcono = (numero) =>
  L.divIcon({
    html: `
      <div style="
        background:#f97316;
        color:white;
        width:34px;
        height:34px;
        border-radius:50%;
        display:flex;
        align-items:center;
        justify-content:center;
        font-weight:bold;
        border:2px solid white;
        box-shadow:0 0 10px rgba(0,0,0,0.4);
      ">
        ${numero}
      </div>
    `,
    className: "",
    iconSize: [34, 34],
    iconAnchor: [17, 17]
  });

function MapaRuta({ ruta = [] }) {

  if (!ruta.length) {
    return null;
  }

  const puntos = ruta.map((item) => [
    item.local.ubicacion.lat,
    item.local.ubicacion.lng
  ]);

  const centro = puntos[0];

  return (
    <div className="
      h-[320px]
      md:h-[450px]
      rounded-3xl
      overflow-hidden
      border
      border-zinc-800
      mt-8
    ">

      <MapContainer
        center={centro}
        zoom={14}
        className="h-full w-full"
      >

        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Polyline
          positions={puntos}
        />

        {
          ruta.map((item, index) => (

            <Marker
              key={item.local._id}
              position={[
                item.local.ubicacion.lat,
                item.local.ubicacion.lng
              ]}
              icon={crearIcono(index + 1)}
            >

              <Popup>

                <div className="min-w-[180px]">

                  <h3 className="font-bold text-lg">
                    {index + 1}. {item.local.nombre}
                  </h3>

                  <p>
                    Categoría:
                    {" "}
                    {item.categoria}
                  </p>

                  <p>
                    Precio:
                    {" "}
                    Q{item.local.precioPromedio}
                  </p>

                </div>

              </Popup>

            </Marker>
          ))
        }

      </MapContainer>

    </div>
  );
}

export default MapaRuta;