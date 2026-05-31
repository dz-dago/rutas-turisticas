function localAbierto(local, fecha = new Date()) {

  const dias = [
    "domingo",
    "lunes",
    "martes",
    "miercoles",
    "jueves",
    "viernes",
    "sabado"
  ];

  const diaActual =
    dias[fecha.getDay()];

  const horario =
    local.horario?.[diaActual];

  if (!horario) {
    return false;
  }

  if (
    horario.toLowerCase() === "cerrado"
  ) {
    return false;
  }

  const partes = horario.split("-");

  if (partes.length !== 2) {
    return true;
  }

  const apertura = partes[0].trim();
  const cierre = partes[1].trim();

  const [horaApertura, minApertura] =
    apertura.split(":").map(Number);

  const [horaCierre, minCierre] =
    cierre.split(":").map(Number);

  const ahoraMinutos =
    fecha.getHours() * 60
    + fecha.getMinutes();

  const aperturaMinutos =
    horaApertura * 60
    + minApertura;

  const cierreMinutos =
    horaCierre * 60
    + minCierre;

  return (
    ahoraMinutos >= aperturaMinutos
    &&
    ahoraMinutos <= cierreMinutos
  );
}

module.exports = localAbierto;