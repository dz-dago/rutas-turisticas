const mongoose = require("mongoose");

const VentanaUsuarioSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
    unique: true
  },

  patrones: {
    type: [String],
    default: []
  }
});

module.exports = mongoose.model("VentanaUsuario", VentanaUsuarioSchema);
