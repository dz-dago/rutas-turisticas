const mongoose = require("mongoose");

const RutaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },

  descripcion: {
    type: String,
    required: true
  },

  tipoRuta: {
    type: String,
    enum: [
      "economica",
      "cercana",
      "mejor_calificada",
      "equilibrada",
      "gastronomica",
      "cultural",
      "natural",
      "familiar"
    ],
    required: true
  },

  zona: {
    type: String,
    required: true
  },

  lugares: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Local",
      required: true
    }
  ],

  distanciaTotal: {
    type: Number,
    default: 0
  },

  duracionEstimada: {
    type: String,
    default: ""
  },

  precioEstimado: {
    type: Number,
    default: 0
  },

  dificultad: {
    type: String,
    enum: ["baja", "media", "alta"],
    default: "baja"
  },

  transporte: {
    type: String,
    enum: ["a pie", "vehiculo", "mixto"],
    default: "a pie"
  },

  rating: {
    type: Number,
    default: 0
  },

  totalResenas: {
    type: Number,
    default: 0
  },

  confianza: {
    type: Number,
    default: 0
  },

  creadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    default: null
  },

  linkGoogleMaps: {
    type: String,
    default: ""
  },

  estado: {
    type: String,
    enum: ["activo", "pendiente", "suspendido"],
    default: "activo"
  },

  fechaRegistro: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Ruta", RutaSchema);