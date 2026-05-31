const express = require("express");

const router = express.Router();

const protegerRuta = require("../middlewares/auth.middleware");

const {
  crearGuia,
  obtenerGuias,
  obtenerGuiaPorId,
  actualizarGuia,
  eliminarGuia,
  obtenerMiPerfilGuia,
  actualizarMiPerfilGuia,
  activarMiSuscripcion,
  registrarContactoGuia,
  valorarGuia
} = require("../controllers/guias.controller");

router.post("/", crearGuia);

router.get("/mi-perfil", protegerRuta, obtenerMiPerfilGuia);

router.put("/mi-perfil", protegerRuta, actualizarMiPerfilGuia);

router.put(
  "/mi-perfil/activar-suscripcion",
  protegerRuta,
  activarMiSuscripcion
);

router.put("/:id/registrar-contacto", registrarContactoGuia);

router.put("/:id/valorar", valorarGuia);

router.get("/", obtenerGuias);

router.get("/:id", obtenerGuiaPorId);

router.put("/:id", actualizarGuia);

router.delete("/:id", eliminarGuia);

module.exports = router;