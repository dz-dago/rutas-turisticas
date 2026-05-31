const PoolGlobal = require("../models/PoolGlobal");

exports.valorarPatron = async (req, res) => {

  try {

    const usuario = req.usuario;

    const {
      patron,
      valor
    } = req.body;

    if (!patron || !valor) {
      return res.status(400).json({
        mensaje: "Patrón y valor son obligatorios"
      });
    }

    if (valor < 1 || valor > 5) {
      return res.status(400).json({
        mensaje: "La valoración debe estar entre 1 y 5"
      });
    }

    let pool = await PoolGlobal.findOne({
      patron
    });

    // CREAR SI NO EXISTE
    if (!pool) {

      pool = await PoolGlobal.create({
        patron
      });
    }

    // SCORE GLOBAL
    const nuevoTotalGlobal =
      (pool.scorePromedio * pool.votos) + valor;

    pool.votos += 1;

    pool.scorePromedio =
      nuevoTotalGlobal / pool.votos;

    // SCORE PERFIL
    const perfil = usuario.perfilTipo;

    const perfilActual =
      pool.perfiles[perfil];

    const nuevoTotalPerfil =
      (perfilActual.score * perfilActual.votos)
      + valor;

    perfilActual.votos += 1;

    perfilActual.score =
      nuevoTotalPerfil / perfilActual.votos;

    // TENDENCIA
    if (pool.scorePromedio >= 4) {
      pool.tendencia = "positiva";
    } else if (pool.scorePromedio <= 2.5) {
      pool.tendencia = "negativa";
    } else {
      pool.tendencia = "neutral";
    }

    // BLOQUEO AUTOMÁTICO
    if (
      pool.votos >= 50
      &&
      pool.scorePromedio < 2.5
    ) {
      pool.bloqueado = true;
    }

    pool.ultimoVoto = new Date();

    await pool.save();

    res.json({
      mensaje: "Valoración registrada correctamente",
      pool
    });

  } catch (error) {

    res.status(500).json({
      mensaje: "Error al valorar patrón",
      error: error.message
    });
  }
};