const calcularDistancia = require("./distancia");
const generarLinkMaps = require("./generarLinkMaps");

const DURACION_CANTIDAD = {
  corta: 3,
  media: 4,
  larga: 5
};

function mezclarArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function precioTotal(lugares) {
  return lugares.reduce(
    (total, local) => total + (local.precioPromedio || 0),
    0
  );
}

function ratingPromedio(lugares) {
  if (!lugares.length) return 0;

  const total = lugares.reduce(
    (sum, local) => sum + (local.rating || 0),
    0
  );

  return Number((total / lugares.length).toFixed(2));
}

function construirRuta(lugares, tipoRuta) {
  return {
    nombre: `Ruta ${tipoRuta.replace("_", " ")}`,
    descripcion: "Ruta turística generada automáticamente según filtros seleccionados.",
    tipoRuta,
    lugares,
    precioEstimado: precioTotal(lugares),
    ratingPromedio: ratingPromedio(lugares),
    duracionEstimada: `${lugares.length} horas`,
    dificultad: lugares.length <= 3 ? "baja" : lugares.length === 4 ? "media" : "alta",
    linkGoogleMaps: generarLinkMaps(
      lugares[0]?.ubicacion || { lat: 15.319, lng: -91.471 },
      lugares
    )
  };
}

function seleccionarPorCategoria(locales, cantidad) {
  const categoriasOrden = ["CAF", "CUL", "NAT", "EXP", "GAS", "ENT", "HIS", "REL"];
  const seleccionados = [];

  for (const categoria of categoriasOrden) {
    if (seleccionados.length >= cantidad) break;

    const candidatos = locales.filter(
      (local) =>
        local.categoria === categoria &&
        !seleccionados.some((s) => String(s._id) === String(local._id))
    );

    if (candidatos.length > 0) {
      seleccionados.push(candidatos[0]);
    }
  }

  if (seleccionados.length < cantidad) {
    const restantes = locales.filter(
      (local) =>
        !seleccionados.some((s) => String(s._id) === String(local._id))
    );

    seleccionados.push(...restantes.slice(0, cantidad - seleccionados.length));
  }

  return seleccionados;
}

function generarCatalogoRutas({
  locales,
  tipo = "todas",
  duracion = "media",
  ubicacion = null
}) {
  const cantidad = DURACION_CANTIDAD[duracion] || 4;
  let rutas = [];

  let base = [...locales];

  if (tipo === "economica") {
    base = base.sort((a, b) => {
      if ((a.precioPromedio || 0) !== (b.precioPromedio || 0)) {
        return (a.precioPromedio || 0) - (b.precioPromedio || 0);
      }

      return (b.rating || 0) - (a.rating || 0);
    });

    for (let i = 0; i < 20; i++) {
      const candidatos = mezclarArray(base).filter(
        (local) => (local.precioPromedio || 0) <= 50
      );

      const lugares = seleccionarPorCategoria(candidatos, cantidad);

      if (lugares.length >= 3 && precioTotal(lugares) <= 100) {
        rutas.push(construirRuta(lugares, "economica"));
      }
    }
  }

  else if (tipo === "mejor_calificada") {
    base = base.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    for (let i = 0; i < 20; i++) {
      const lugares = seleccionarPorCategoria(
        mezclarArray(base.slice(0, 25)),
        cantidad
      );

      if (lugares.length >= 3) {
        rutas.push(construirRuta(lugares, "mejor_calificada"));
      }
    }
  }

  else if (tipo === "cercana" && ubicacion?.lat && ubicacion?.lng) {
    base = base
      .map((local) => ({
        ...local.toObject?.() || local,
        distancia: calcularDistancia(
          ubicacion.lat,
          ubicacion.lng,
          local.ubicacion.lat,
          local.ubicacion.lng
        )
      }))
      .sort((a, b) => a.distancia - b.distancia);

    for (let i = 0; i < 20; i++) {
      const lugares = seleccionarPorCategoria(
        mezclarArray(base.slice(0, 30)),
        cantidad
      );

      if (lugares.length >= 3) {
        rutas.push(construirRuta(lugares, "cercana"));
      }
    }
  }

  else if (tipo === "equilibrada") {
    base = base.sort((a, b) => {
      const scoreA =
        (a.rating || 0) * 0.6 -
        (a.precioPromedio || 0) * 0.01;

      const scoreB =
        (b.rating || 0) * 0.6 -
        (b.precioPromedio || 0) * 0.01;

      return scoreB - scoreA;
    });

    for (let i = 0; i < 20; i++) {
      const lugares = seleccionarPorCategoria(
        mezclarArray(base.slice(0, 35)),
        cantidad
      );

      if (lugares.length >= 3) {
        rutas.push(construirRuta(lugares, "equilibrada"));
      }
    }
  }

  else {
    for (let i = 0; i < 20; i++) {
      const lugares = seleccionarPorCategoria(
        mezclarArray(base),
        cantidad
      );

      if (lugares.length >= 3) {
        rutas.push(construirRuta(lugares, "todas"));
      }
    }
  }

  const rutasUnicas = [];

  const firmas = new Set();

  for (const ruta of rutas) {
    const firma = ruta.lugares
      .map((local) => String(local._id))
      .join("-");

    if (!firmas.has(firma)) {
      firmas.add(firma);
      rutasUnicas.push(ruta);
    }
  }

  return rutasUnicas.slice(0, 20);
}

module.exports = generarCatalogoRutas;
