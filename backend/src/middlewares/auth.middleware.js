const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

const protegerRuta = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        mensaje: "Token no proporcionado"
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const usuario = await Usuario.findById(decoded.id).select("-password");

    if (!usuario) {
      return res.status(401).json({
        mensaje: "Usuario no encontrado"
      });
    }

    req.usuario = usuario;

    next();

  } catch (error) {
    return res.status(401).json({
      mensaje: "Token inválido"
    });
  }
};

module.exports = protegerRuta;