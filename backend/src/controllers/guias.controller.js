const Guia = require("../models/Guia");

exports.crearGuia = async (req, res) => {
  try {
    const {
      fotoPerfil,
      avatar,
      credencialIdentificacion,
      telefono,
      ...rest
    } = req.body;

    const guia = await Guia.create({
      ...rest,
      fotoPerfil: fotoPerfil || avatar || "",
      credencialIdentificacion: credencialIdentificacion || "",
      telefono: telefono || ""
    });

    res.status(201).json({
      mensaje: "Guía creado correctamente",
      guia
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear guía",
      error: error.message
    });
  }
};

exports.obtenerGuias = async (req, res) => {
  try {
    const guias = await Guia.find({
      estado: "activo",
      suscripcionActiva: true
    })
      .populate("usuarioId", "nombre email telefono avatar confianza");

    res.json(guias);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener guías"
    });
  }
};

exports.obtenerGuiaPorId = async (req, res) => {
  try {
    const guia = await Guia.findById(req.params.id)
      .populate("usuarioId", "nombre email telefono avatar confianza");

    if (!guia) {
      return res.status(404).json({
        mensaje: "Guía no encontrado"
      });
    }

    res.json(guia);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener guía"
    });
  }
};

exports.actualizarGuia = async (req, res) => {
  try {
    const guia = await Guia.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!guia) {
      return res.status(404).json({
        mensaje: "Guía no encontrado"
      });
    }

    res.json({
      mensaje: "Guía actualizado correctamente",
      guia
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar guía"
    });
  }
};

exports.eliminarGuia = async (req, res) => {
  try {
    const guia = await Guia.findByIdAndUpdate(
      req.params.id,
      { estado: "suspendido" },
      { new: true }
    );

    if (!guia) {
      return res.status(404).json({
        mensaje: "Guía no encontrado"
      });
    }

    res.json({
      mensaje: "Guía suspendido correctamente",
      guia
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al suspender guía"
    });
  }
};

exports.obtenerMiPerfilGuia = async (req, res) => {
  try {
    const guia = await Guia.findOne({
      usuarioId: req.usuario._id
    }).populate("usuarioId", "nombre email rol telefono");

    if (!guia) {
      return res.status(404).json({
        mensaje: "No existe perfil de guía para este usuario"
      });
    }

    res.json(guia);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener perfil de guía",
      error: error.message
    });
  }
};

exports.actualizarMiPerfilGuia = async (req, res) => {
  try {
    const guia = await Guia.findOneAndUpdate(
      { usuarioId: req.usuario._id },
      req.body,
      { new: true }
    ).populate("usuarioId", "nombre email rol telefono");

    if (!guia) {
      return res.status(404).json({
        mensaje: "No existe perfil de guía para este usuario"
      });
    }

    res.json({
      mensaje: "Perfil de guía actualizado correctamente",
      guia
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar perfil de guía",
      error: error.message
    });
  }
};

exports.activarMiSuscripcion = async (req, res) => {
  try {
    const guia = await Guia.findOneAndUpdate(
      { usuarioId: req.usuario._id },
      { suscripcionActiva: true, estado: "activo" },
      { new: true }
    );

    if (!guia) {
      return res.status(404).json({
        mensaje: "No existe perfil de guía para este usuario"
      });
    }

    res.json({
      mensaje: "Suscripción activada correctamente",
      guia
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al activar suscripción",
      error: error.message
    });
  }
};

exports.registrarContactoGuia = async (req, res) => {
  try {
    const guia = await Guia.findByIdAndUpdate(
      req.params.id,
      { $inc: { contactosGenerados: 1 } },
      { new: true }
    );

    if (!guia) {
      return res.status(404).json({
        mensaje: "Guía no encontrado"
      });
    }

    res.json({
      mensaje: "Contacto registrado correctamente",
      guia
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al registrar contacto",
      error: error.message
    });
  }
};

exports.valorarGuia = async (req, res) => {
  try {
    const { valor } = req.body;

    if (!valor || valor < 1 || valor > 5) {
      return res.status(400).json({
        mensaje: "La valoración debe estar entre 1 y 5"
      });
    }

    const guia = await Guia.findById(req.params.id);

    if (!guia) {
      return res.status(404).json({
        mensaje: "Guía no encontrado"
      });
    }

    const nuevoTotal =
      (guia.rating * guia.totalResenas) + Number(valor);

    guia.totalResenas += 1;
    guia.rating = Number(
      (
        nuevoTotal /
        guia.totalResenas
      ).toFixed(2)
    );

    await guia.save();

    res.json({
      mensaje: "Valoración registrada correctamente",
      guia
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al valorar guía",
      error: error.message
    });
  }
};