const energiaCategorias = require("./energiaCategorias");

function generarPatronRuta({
  patronesRecientes = [],
  preferencias = [],
  evitar = [],
  modo = "equilibrada",
  categoriasDisponibles = []
}) {

  const flexibles = [
    "CUL",
    "EXP",
    "ENT",
    "NAT",
    "HIS",
    "REL"
  ];

  const filtrarCategorias = () => {
    return flexibles.filter(
      (cat) =>
        !evitar.includes(cat)
        &&
        categoriasDisponibles.includes(cat)
    );
  };

  const elegirCategoria = (
    disponibles,
    usadas = []
  ) => {

    let opciones = disponibles.filter(
      (cat) => !usadas.includes(cat)
    );

    // prioridad a preferencias
    const preferidas = opciones.filter(
      (cat) => preferencias.includes(cat)
    );

    if (preferidas.length > 0) {
      opciones = preferidas;
    }

    return opciones[
      Math.floor(Math.random() * opciones.length)
    ];
  };

  let patron = "";
  let intentos = 0;

  do {

    const disponibles = filtrarCategorias();

    const pos2 = elegirCategoria(
      disponibles,
      []
    );

    const pos3 = elegirCategoria(
      disponibles,
      []
    );

    const pos5 = elegirCategoria(
      disponibles,
      []
    );

    patron = [
      "CAF",
      pos2,
      pos3,
      "GAS",
      pos5
    ].join("·");

    intentos++;

  } while (
    patronesRecientes.includes(patron)
    && intentos < 20
  );

  return patron;
}

module.exports = generarPatronRuta;