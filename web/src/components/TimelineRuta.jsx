import React from "react";

const imagenesCategorias = {
  COMIDA: "https://via.placeholder.com/400x300?text=Comida",
  CULTURA: "https://via.placeholder.com/400x300?text=Cultura",
  NATURALEZA: "https://via.placeholder.com/400x300?text=Naturaleza",
  AVENTURA: "https://via.placeholder.com/400x300?text=Aventura",
  COMPRAS: "https://via.placeholder.com/400x300?text=Compras",
  EXP: "https://via.placeholder.com/400x300?text=Experiencia"
};

function TimelineRuta({ ruta = [] }) {
  if (!ruta.length) return null;

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-6">
        Recorrido recomendado
      </h3>

      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-[2px] bg-zinc-700" />

        <div className="space-y-6">
          {ruta.map((item, index) => {
            const imagenLocal =
              item.local.fotos?.[0] ||
              imagenesCategorias[item.categoria] ||
              imagenesCategorias.EXP;

            return (
              <div
                key={item.local._id}
                className="
                  relative
                  flex
                  flex-col
                  md:flex-row
                  gap-5
                "
              >
              <div className="z-10 w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center font-bold border-2 border-white">
                {index + 1}
              </div>

              <div className="flex-1 bg-zinc-800 border border-zinc-700 rounded-2xl p-5 hover:border-orange-500 transition overflow-hidden">
                {imagenLocal && (
                  <div
                    className="w-full h-48 rounded-lg mb-4 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${imagenLocal})`
                    }}
                  />
                )}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-xl font-bold">
                      {item.local.nombre}
                    </h4>

                    <p className="text-zinc-400 mt-1">
                      {item.local.descripcion}
                    </p>
                  </div>

                  <span className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-sm font-semibold">
                    {item.categoria}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-5">
                  <div>
                    <p className="text-zinc-500 text-sm">Precio</p>
                    <p className="font-bold">Q{item.local.precioPromedio}</p>
                  </div>

                  <div>
                    <p className="text-zinc-500 text-sm">Rating</p>
                    <p className="font-bold">{item.local.rating || 0}/5</p>
                  </div>

                  <div>
                    <p className="text-zinc-500 text-sm">Dirección</p>
                    <p className="font-bold">
                      {item.local.ubicacion?.direccion || "Huehuetenango"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default TimelineRuta;