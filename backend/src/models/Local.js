const mongoose = require("mongoose");

const LocalSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },

  categoria: {
    type: String,
    enum: ["CAF", "CUL", "EXP", "GAS", "ENT", "NAT", "HIS", "REL", "HOS"],
    required: true
  },

  descripcion: {
    type: String,
    required: true
  },

  ubicacion: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    },
    direccion: {
      type: String,
      default: ""
    }
  },

  fotos: {
    type: [String],
    default: []
  },

  horario: {
    lunes: { type: String, default: "" },
    martes: { type: String, default: "" },
    miercoles: { type: String, default: "" },
    jueves: { type: String, default: "" },
    viernes: { type: String, default: "" },
    sabado: { type: String, default: "" },
    domingo: { type: String, default: "" }
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

  vecesUsado: {
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
    required: true
  },

  estado: {
    type: String,
    enum: ["activo", "suspendido", "pendiente"],
    default: "pendiente"
  },

  suscripcionActiva: {
    type: Boolean,
    default: false
  },

  fechaRegistro: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Local", LocalSchema);