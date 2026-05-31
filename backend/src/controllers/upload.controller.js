exports.subirImagen = (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      mensaje: "No se subió ninguna imagen"
    });
  }

  const url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

  res.json({
    mensaje: "Imagen subida correctamente",
    url
  });
};
