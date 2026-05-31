function generarLinkMaps(lugares = []) {

  if (!lugares.length) {
    return "";
  }

  const puntos = lugares.map((item) => {

    const local = item.local || item;

    return `${local.ubicacion.lat},${local.ubicacion.lng}`;
  });

  return `https://www.google.com/maps/dir/${puntos.join("/")}`;
}

module.exports = generarLinkMaps;