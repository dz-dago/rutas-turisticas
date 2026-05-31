function seleccionarPatronInteligente({
  pools = [],
  perfilTipo = "TUR"
}) {

  if (!pools.length) {
    return null;
  }

  const usarAprendido =
    Math.random() < 0.7;

  // EXPLORACIÓN
  if (!usarAprendido) {
    return null;
  }

  pools.sort((a, b) => {

    const scoreA =
      a.perfiles?.[perfilTipo]?.score
      || a.scorePromedio
      || 0;

    const scoreB =
      b.perfiles?.[perfilTipo]?.score
      || b.scorePromedio
      || 0;

    return scoreB - scoreA;
  });

  const top = pools.slice(0, 5);

  return top[
    Math.floor(Math.random() * top.length)
  ];
}

module.exports = seleccionarPatronInteligente;