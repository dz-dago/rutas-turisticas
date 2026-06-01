const cloudinary = require("../config/cloudinary");

exports.subirImagen = async (req, res) => {
  console.log("REQ FILE:", req.file);
  try {

    if (!req.file) {
      return res.status(400).json({
        mensaje: "No se subió ninguna imagen"
      });
    }

    const resultado = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: "rutas-turisticas"
      }
    );

    return res.json({
      mensaje: "Imagen subida correctamente",
      url: resultado.secure_url
    });

  } catch (error) {

    console.error("Error Cloudinary:", error);

    return res.status(500).json({
      mensaje: "Error al subir imagen"
    });
  }
};
