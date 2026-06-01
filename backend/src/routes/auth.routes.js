const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/Usuario");
const Guia = require("../models/Guia");
const protegerRuta = require("../middlewares/auth.middleware");

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login`
  }),
  (req, res) => {
    const token = jwt.sign(
      {
        id: req.user._id,
        rol: req.user.rol
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
  }
);

router.get("/perfil", protegerRuta, (req, res) => {
  res.json(req.usuario);
});

router.post("/completar-perfil", protegerRuta, async (req, res) => {
  try {
    const {
      rol,
      telefono,
      nacionalidad,
      perfilTipo,
      fotoPerfil,
      documentoIdentidad,
      credencialIdentificacion,
      idiomas,
      descripcion,
      experiencia,
      rutasOfrecidas,
      precioPromedio
    } = req.body;

    req.usuario.rol = rol || req.usuario.rol;
    req.usuario.telefono = telefono || req.usuario.telefono;
    req.usuario.nacionalidad = nacionalidad || req.usuario.nacionalidad;
    req.usuario.perfilTipo = perfilTipo || req.usuario.perfilTipo;

    req.usuario.fotoPerfil =
      fotoPerfil || req.usuario.fotoPerfil;

    req.usuario.avatar =
      fotoPerfil || req.usuario.avatar;

    req.usuario.documentoIdentidad =
      documentoIdentidad || req.usuario.documentoIdentidad;

    req.usuario.credencialIdentificacion =
      credencialIdentificacion || req.usuario.credencialIdentificacion;

    req.usuario.idiomas =
      idiomas || req.usuario.idiomas;

    req.usuario.descripcion =
      descripcion || req.usuario.descripcion;

    req.usuario.experiencia =
      experiencia || req.usuario.experiencia;

    req.usuario.rutasOfrecidas =
      rutasOfrecidas || req.usuario.rutasOfrecidas;

    req.usuario.precioPromedio =
      precioPromedio || req.usuario.precioPromedio;

    req.usuario.perfilCompleto = true;

    await req.usuario.save();

    res.json({
      mensaje: "Perfil completado correctamente",
      usuario: req.usuario
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al completar perfil"
    });
  }
});

router.post("/registro", async (req, res) => {
  try {
    const {
      nombre,
      email,
      password,
      rol,
      telefono,
      nacionalidad,
      perfilTipo,
      avatar,
      fotoPerfil,
      documentoIdentidad,
      credencialIdentificacion,
      idiomas,
      descripcion,
      experiencia,
      rutasOfrecidas,
      precioPromedio
    } = req.body;

    if (!nombre || !email || !password || !rol) {
      return res.status(400).json({
        mensaje: "Nombre, email, contraseña y rol son obligatorios"
      });
    }

    const usuarioExiste = await Usuario.findOne({
      email: email.toLowerCase()
    });

    if (usuarioExiste) {
      return res.status(400).json({
        mensaje: "Ya existe una cuenta con este correo"
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const usuario = await Usuario.create({
      nombre,
      email: email.toLowerCase(),
      password: passwordHash,
      rol,
      telefono: telefono || "",
      nacionalidad: nacionalidad || "Guatemala",
      perfilTipo: rol === "turista" ? perfilTipo || "TUR" : null,
      avatar: fotoPerfil || avatar || "",
      fotoPerfil: fotoPerfil || avatar || "",
      documentoIdentidad:
        documentoIdentidad || "",
      provider: "local",
      perfilCompleto: true,
      verificacion: {
        emailVerificado: false,
        telefonoVerificado: false
      }
    });

    if (rol === "guia") {
      await Guia.create({
        usuarioId: usuario._id,
        telefono: telefono || "",
        fotoPerfil: fotoPerfil || avatar || "",
        credencialIdentificacion: credencialIdentificacion || "",
        idiomas: Array.isArray(idiomas) ? idiomas : [],
        descripcion: descripcion || "",
        experiencia: experiencia || "",
        rutasOfrecidas: Array.isArray(rutasOfrecidas) ? rutasOfrecidas : [],
        precioPromedio: Number(precioPromedio) || 0,
        estado: "pendiente",
        suscripcionActiva: false
      });
    }

    const token = jwt.sign(
      {
        id: usuario._id,
        rol: usuario.rol
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      mensaje: "Cuenta creada correctamente",
      token,
      usuario
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al registrar usuario",
      error: error.message
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        mensaje: "Email y contraseña son obligatorios"
      });
    }

    const usuario = await Usuario.findOne({
      email: email.toLowerCase()
    });

    if (!usuario || !usuario.password) {
      return res.status(401).json({
        mensaje: "Credenciales inválidas"
      });
    }

    const passwordValido = await bcrypt.compare(
      password,
      usuario.password
    );

    if (!passwordValido) {
      return res.status(401).json({
        mensaje: "Credenciales inválidas"
      });
    }

    if (usuario.estado !== "activo") {
      return res.status(403).json({
        mensaje: "Usuario no activo"
      });
    }

    const token = jwt.sign(
      {
        id: usuario._id,
        rol: usuario.rol
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      mensaje: "Inicio de sesión correcto",
      token,
      usuario
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al iniciar sesión",
      error: error.message
    });
  }
});

module.exports = router;