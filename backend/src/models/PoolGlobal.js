const mongoose = require("mongoose");

const perfilScoreSchema = {
  score: { type: Number, default: 0 },
  votos: { type: Number, default: 0 }
};

const PoolGlobalSchema = new mongoose.Schema({
  patron: {
    type: String,
    required: true,
    unique: true
  },

  scorePromedio: {
    type: Number,
    default: 0
  },

  votos: {
    type: Number,
    default: 0
  },

  bloqueado: {
    type: Boolean,
    default: false
  },

  perfiles: {
    FAM: perfilScoreSchema,
    PAR: perfilScoreSchema,
    SOL: perfilScoreSchema,
    GRP: perfilScoreSchema,
    LOC: perfilScoreSchema,
    TUR: perfilScoreSchema
  },

  tendencia: {
    type: String,
    default: "neutral"
  },

  ultimoVoto: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model("PoolGlobal", PoolGlobalSchema);
