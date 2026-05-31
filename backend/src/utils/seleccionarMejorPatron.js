function seleccionarMejorPatron(
  patrones = [],
  perfilTipo = "TUR"
) {

  if (!patrones.length) {
    return null;
  }

  patrones.sort((a, b) => {

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

  return patrones[0];
}

module.exports = seleccionarMejorPatron;