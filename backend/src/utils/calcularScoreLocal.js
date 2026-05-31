function calcularScoreLocal(local, contexto = {}) {
  const {
    modo = "equilibrada",
    distancia = 0,
    presupuestoMax = null
  } = contexto;

  const precio = local.precioPromedio || 0;
  const rating = local.rating || 0;
  const confianza = local.confianza || 0;
  const vecesUsado = local.vecesUsado || 0;

  const penalizacionUso = vecesUsado * 0.05;

  let score = 0;

  if (modo === "economica") {
    score =
      precio * 0.5 +
      distancia * 0.3 -
      rating * 0.15 -
      confianza * 0.05 +
      penalizacionUso;
  } else if (modo === "cercana") {
    score =
      distancia * 0.7 +
      precio * 0.1 -
      rating * 0.15 -
      confianza * 0.05 +
      penalizacionUso;
  } else if (modo === "mejor_calificada") {
    score =
      distancia * 0.2 +
      precio * 0.1 -
      rating * 0.5 -
      confianza * 0.2 +
      penalizacionUso;
  } else {
    score =
      distancia * 0.4 +
      precio * 0.25 -
      rating * 0.25 -
      confianza * 0.1 +
      penalizacionUso;
  }

  if (presupuestoMax && precio > presupuestoMax) {
    score += 100;
  }

  return score;
}

module.exports = calcularScoreLocal;