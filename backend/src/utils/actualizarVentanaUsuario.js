const VentanaUsuario = require("../models/VentanaUsuario");

async function actualizarVentanaUsuario(usuarioId, patron) {
  let ventana = await VentanaUsuario.findOne({ usuario: usuarioId });

  if (!ventana) {
    ventana = await VentanaUsuario.create({
      usuario: usuarioId,
      patrones: [patron]
    });

    return ventana;
  }

  ventana.patrones = ventana.patrones.filter((p) => p !== patron);
  ventana.patrones.unshift(patron);
  ventana.patrones = ventana.patrones.slice(0, 10);

  await ventana.save();

  return ventana;
}

module.exports = actualizarVentanaUsuario;
