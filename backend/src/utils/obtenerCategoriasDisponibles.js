const Local = require("../models/Local");

async function obtenerCategoriasDisponibles() {

  const locales = await Local.find({
    estado: "activo"
  }).select("categoria");

  const categorias = [
    ...new Set(
      locales.map((l) => l.categoria)
    )
  ];

  return categorias;
}

module.exports = obtenerCategoriasDisponibles;