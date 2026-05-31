const express = require("express");

const router = express.Router();

const upload = require("../middlewares/upload.middleware");

const {
  subirImagen
} = require("../controllers/upload.controller");

router.post(
  "/imagen",
  upload.single("imagen"),
  subirImagen
);

module.exports = router;
