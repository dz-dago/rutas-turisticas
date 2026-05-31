const calcularDistancia = require(
  "./distancia"
);

const tiempoCategorias = require(
  "./tiempoCategorias"
);

function calcularDuracionRuta(ruta = []) {

  let minutos = 0;

  for (let i = 0; i < ruta.length; i++) {

    const actual = ruta[i];

    minutos +=
      tiempoCategorias[
        actual.categoria
      ] || 60;

    // tiempo traslado
    if (i > 0) {

      const anterior =
        ruta[i - 1];

      const distancia =
        calcularDistancia(
          anterior.local.ubicacion.lat,
          anterior.local.ubicacion.lng,
          actual.local.ubicacion.lat,
          actual.local.ubicacion.lng
        );

      // conversión simple
      minutos += distancia * 20;
    }
  }

  return minutos;
}

module.exports = calcularDuracionRuta;