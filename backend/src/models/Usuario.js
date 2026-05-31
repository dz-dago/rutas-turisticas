const mongoose = require("mongoose");



const UsuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  password: {
    type: String,
    default: null
  },

  telefono: {
    type: String,
    default: ""
  },

  rol: {
    type: String,
    enum: ["turista", "guia", "propietario", "admin"],
    required: true
  },

  perfilTipo: {
    type: String,
    enum: ["FAM", "PAR", "SOL", "GRP", "LOC", "TUR"],
    required: false,
    default: null
  },

  nacionalidad: {
    type: String,
    default: "Guatemala"
  },

  provider: {
    type: String,
    enum: ["local", "google"],
    default: "local"
  },

  googleId: {
    type: String,
    default: null
  },

  avatar: {
    type: String,
    default: ""
  },

  fotoPerfil: {
    type: String,
    default: ""
  },

  perfilCompleto: {
    type: Boolean,
    default: false
  },

  verificacion: {
    emailVerificado: {
      type: Boolean,
      default: false
    },

    telefonoVerificado: {
      type: Boolean,
      default: false
    }
  },

  confianza: {
    type: Number,
    default: 0
  },

  estado: {
    type: String,
    enum: ["activo", "suspendido", "pendiente"],
    default: "activo"
  },

  fechaRegistro: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Usuario", UsuarioSchema);