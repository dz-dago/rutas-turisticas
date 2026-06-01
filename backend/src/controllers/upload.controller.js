const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

exports.subirImagen = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        mensaje: "No se subió ninguna imagen"
      });
    }

    const resultado = await new Promise(
      (resolve, reject) => {

        const stream =
          cloudinary.uploader.upload_stream(
            {
              folder: "rutas-turisticas"
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );

        streamifier
          .createReadStream(req.file.buffer)
          .pipe(stream);
      }
    );

    return res.json({
      mensaje: "Imagen subida correctamente",
      url: resultado.secure_url
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      mensaje: "Error al subir imagen"
    });
  }
};
