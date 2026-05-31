const mongoose = require("mongoose");

const ResenaSchema = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  },

  referenciaId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },

  tipoReferencia: {
    type: String,
    enum: ["local", "guia"],
    required: true
  },

  calificacion: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },

  comentario: {
    type: String,
    default: ""
  },

  fecha: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Resena", ResenaSchema);