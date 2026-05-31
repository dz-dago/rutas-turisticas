const express = require("express");
const router = express.Router();

const protegerRuta = require("../middlewares/auth.middleware");
const {
  listarEventos,
  listarEventosAdmin,
  crearEvento,
  eliminarEvento,
  toggleEvento
} = require("../controllers/eventos.controller");

// Middleware para verificar rol admin
const soloAdmin = (req, res, next) => {
  if (req.usuario?.rol !== "admin") {
    return res.status(403).json({ mensaje: "Acceso denegado: solo administradores" });
  }
  next();
};

// Público — solo eventos activos
router.get("/", listarEventos);

// Admin — todos los eventos
router.get("/admin", protegerRuta, soloAdmin, listarEventosAdmin);

// Admin — crear evento
router.post("/", protegerRuta, soloAdmin, crearEvento);

// Admin — eliminar evento
router.delete("/:id", protegerRuta, soloAdmin, eliminarEvento);

// Admin — activar/desactivar evento
router.patch("/:id/toggle", protegerRuta, soloAdmin, toggleEvento);

module.exports = router;
