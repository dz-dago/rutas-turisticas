const express = require("express");

const router = express.Router();

const protegerRuta = require("../middlewares/auth.middleware");

const {
  crearRuta,
  obtenerRutas,
  obtenerRutaPorId,
  actualizarRuta,
  eliminarRuta,
  generarRutaInteligente,
  generarCatalogo
} = require("../controllers/rutas.controller");

router.post("/", crearRuta);

router.get("/", obtenerRutas);

router.post(
  "/generar-inteligente",
  protegerRuta,
  generarRutaInteligente
);

router.post("/generar-catalogo", generarCatalogo);

router.get("/:id", obtenerRutaPorId);

router.put("/:id", actualizarRuta);

router.delete("/:id", eliminarRuta);

module.exports = router;