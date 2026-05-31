const mongoose = require("mongoose");

const GuiaSchema = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  },

  telefono: {
    type: String,
    default: ""
  },

  fotoPerfil: {
    type: String,
    default: ""
  },

  credencialIdentificacion: {
    type: String,
    default: ""
  },

  idiomas: {
    type: [String],
    default: []
  },

  descripcion: {
    type: String,
    default: ""
  },

  experiencia: {
    type: String,
    default: ""
  },

  rutasOfrecidas: {
    type: [String],
    default: []
  },

  precioPromedio: {
    type: Number,
    default: 0
  },

  rating: {
    type: Number,
    default: 0
  },

  totalResenas: {
    type: Number,
    default: 0
  },

  contactosGenerados: {
    type: Number,
    default: 0
  },

  confianza: {
    type: Number,
    default: 0
  },

  estado: {
    type: String,
    enum: ["activo", "pendiente", "suspendido"],
    default: "pendiente"
  },

  suscripcionActiva: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Guia", GuiaSchema);