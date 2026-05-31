const mongoose = require("mongoose");

const EventoSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
    trim: true
  },

  descripcion: {
    type: String,
    required: true,
    trim: true
  },

  imagen: {
    type: String,
    required: true
  },

  ubicacion: {
    nombre: {
      type: String,
      required: true,
      trim: true
    },
    lat: {
      type: Number,
      default: null
    },
    lng: {
      type: Number,
      default: null
    },
    linkMaps: {
      type: String,
      default: ""
    }
  },

  fechaEvento: {
    type: Date,
    default: null
  },

  activo: {
    type: Boolean,
    default: true
  },

  creadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    default: null
  },

  fechaCreacion: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Evento", EventoSchema);
