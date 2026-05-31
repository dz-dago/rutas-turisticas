const Evento = require("../models/Evento");

// GET /api/eventos — público, solo eventos activos
exports.listarEventos = async (req, res) => {
  try {
    const eventos = await Evento.find({ activo: true }).sort({ fechaCreacion: -1 });
    res.json(eventos);
  } catch (error) {
    console.error("Error al listar eventos:", error);
    res.status(500).json({ mensaje: "Error al obtener eventos" });
  }
};

// GET /api/eventos/admin — admin, todos los eventos
exports.listarEventosAdmin = async (req, res) => {
  try {
    const eventos = await Evento.find().sort({ fechaCreacion: -1 });
    res.json(eventos);
  } catch (error) {
    console.error("Error al listar eventos (admin):", error);
    res.status(500).json({ mensaje: "Error al obtener eventos" });
  }
};

// POST /api/eventos — admin, crear evento
exports.crearEvento = async (req, res) => {
  try {
    const { titulo, descripcion, imagen, ubicacion, fechaEvento } = req.body;

    if (!titulo || !descripcion || !imagen || !ubicacion?.nombre) {
      return res.status(400).json({ mensaje: "Faltan campos requeridos: titulo, descripcion, imagen, ubicacion.nombre" });
    }

    const evento = new Evento({
      titulo,
      descripcion,
      imagen,
      ubicacion,
      fechaEvento: fechaEvento || null,
      creadoPor: req.usuario._id
    });

    await evento.save();
    res.status(201).json({ mensaje: "Evento creado", evento });
  } catch (error) {
    console.error("Error al crear evento:", error);
    res.status(500).json({ mensaje: "Error al crear evento" });
  }
};

// DELETE /api/eventos/:id — admin, eliminar evento
exports.eliminarEvento = async (req, res) => {
  try {
    const evento = await Evento.findByIdAndDelete(req.params.id);

    if (!evento) {
      return res.status(404).json({ mensaje: "Evento no encontrado" });
    }

    res.json({ mensaje: "Evento eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar evento:", error);
    res.status(500).json({ mensaje: "Error al eliminar evento" });
  }
};

// PATCH /api/eventos/:id/toggle — admin, activar/desactivar
exports.toggleEvento = async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.id);

    if (!evento) {
      return res.status(404).json({ mensaje: "Evento no encontrado" });
    }

    evento.activo = !evento.activo;
    await evento.save();

    res.json({ mensaje: `Evento ${evento.activo ? "activado" : "desactivado"}`, evento });
  } catch (error) {
    console.error("Error al cambiar estado del evento:", error);
    res.status(500).json({ mensaje: "Error al actualizar evento" });
  }
};
