const express = require("express");
const router = express.Router();
const protegerRuta = require("../middlewares/auth.middleware");

const {
  crearLocal,
  obtenerLocales,
  obtenerLocalPorId,
  actualizarLocal,
  eliminarLocal,
  crearMiLocal,
  obtenerMisLocales,
  activarSuscripcionLocal,
  valorarLocal
} = require("../controllers/lugares.controller");

router.post("/mis-locales", protegerRuta, crearMiLocal);
router.get("/mis-locales", protegerRuta, obtenerMisLocales);
router.put("/mis-locales/:id/activar-suscripcion", protegerRuta, activarSuscripcionLocal);

router.post("/", crearLocal);
router.get("/", obtenerLocales);
router.put("/:id/valorar", valorarLocal);
router.get("/:id", obtenerLocalPorId);
router.put("/:id", actualizarLocal);
router.delete("/:id", eliminarLocal);

module.exports = router;