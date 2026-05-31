function calcularDistancia(lat1, lng1, lat2, lng2) {
  const dx = lat1 - lat2;
  const dy = lng1 - lng2;

  return Math.sqrt(dx * dx + dy * dy);
}

module.exports = calcularDistancia;