const Local = require("../models/Local");

exports.crearLocal = async (req, res) => {
  try {
    const local = await Local.create(req.body);

    res.status(201).json({
      mensaje: "Local creado correctamente",
      local
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear local",
      error: error.message
    });
  }
};

exports.obtenerLocales = async (req, res) => {
  try {
    const locales = await Local.find({
      estado: "activo",
      suscripcionActiva: true
    })
      .populate("creadoPor", "nombre email rol");

    res.json(locales);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener locales"
    });
  }
};

exports.obtenerLocalPorId = async (req, res) => {
  try {
    const local = await Local.findById(req.params.id)
      .populate("creadoPor", "nombre email rol");

    if (!local) {
      return res.status(404).json({
        mensaje: "Local no encontrado"
      });
    }

    res.json(local);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener local"
    });
  }
};

exports.actualizarLocal = async (req, res) => {
  try {
    const local = await Local.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!local) {
      return res.status(404).json({
        mensaje: "Local no encontrado"
      });
    }

    res.json({
      mensaje: "Local actualizado correctamente",
      local
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar local"
    });
  }
};

exports.eliminarLocal = async (req, res) => {
  try {
    const local = await Local.findByIdAndUpdate(
      req.params.id,
      { estado: "suspendido" },
      { new: true }
    );

    if (!local) {
      return res.status(404).json({
        mensaje: "Local no encontrado"
      });
    }

    res.json({
      mensaje: "Local suspendido correctamente",
      local
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al suspender local"
    });
  }
};

exports.crearMiLocal = async (req, res) => {
  try {
    const local = await Local.create({
      ...req.body,
      creadoPor: req.usuario._id,
      estado: "pendiente",
      suscripcionActiva: false
    });

    res.status(201).json({
      mensaje: "Local creado correctamente. Activa la suscripción para hacerlo visible.",
      local
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear local",
      error: error.message
    });
  }
};

exports.obtenerMisLocales = async (req, res) => {
  try {
    const locales = await Local.find({
      creadoPor: req.usuario._id
    }).sort({ fechaRegistro: -1 });

    res.json(locales);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener tus locales",
      error: error.message
    });
  }
};

exports.activarSuscripcionLocal = async (req, res) => {
  try {
    const local = await Local.findOneAndUpdate(
      {
        _id: req.params.id,
        creadoPor: req.usuario._id
      },
      {
        suscripcionActiva: true,
        estado: "activo"
      },
      { new: true }
    );

    if (!local) {
      return res.status(404).json({
        mensaje: "Local no encontrado"
      });
    }

    res.json({
      mensaje: "Suscripción activada. El local ya aparece públicamente.",
      local
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al activar suscripción",
      error: error.message
    });
  }
};

exports.valorarLocal = async (req, res) => {
  try {
    const { valor } = req.body;

    if (!valor || valor < 1 || valor > 5) {
      return res.status(400).json({
        mensaje: "La valoración debe estar entre 1 y 5"
      });
    }

    const local = await Local.findById(req.params.id);

    if (!local) {
      return res.status(404).json({
        mensaje: "Local no encontrado"
      });
    }

    const nuevoTotal =
      (local.rating * local.totalResenas) +
      Number(valor);

    local.totalResenas += 1;

    local.rating = Number(
      (
        nuevoTotal /
        local.totalResenas
      ).toFixed(2)
    );

    await local.save();

    res.json({
      mensaje: "Valoración registrada correctamente",
      local
    });

  } catch (error) {

    res.status(500).json({
      mensaje: "Error al valorar local",
      error: error.message
    });
  }
};