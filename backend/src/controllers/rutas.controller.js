const calcularDistancia = require("../utils/distancia");
const Ruta = require("../models/Ruta");
const Local = require("../models/Local");
const VentanaUsuario = require("../models/VentanaUsuario");
const PoolGlobal = require("../models/PoolGlobal");
const generarPatronRuta = require("../utils/generarPatronRuta");
const actualizarVentanaUsuario = require("../utils/actualizarVentanaUsuario");
const calcularScoreLocal = require("../utils/calcularScoreLocal");
const obtenerCategoriasDisponibles = require(
  "../utils/obtenerCategoriasDisponibles"
);
const seleccionarMejorPatron = require(
  "../utils/seleccionarMejorPatron"
);
const seleccionarPatronInteligente = require(
  "../utils/seleccionarPatronInteligente"
);
const localAbierto = require(
  "../utils/localAbierto"
);
const calcularDuracionRuta = require(
  "../utils/calcularDuracionRuta"
);
const generarLinkMaps = require(
  "../utils/generarLinkMaps"
);
const generarCatalogoRutas = require("../utils/generarCatalogoRutas");

exports.crearRuta = async (req, res) => {
  try {
    const ruta = await Ruta.create(req.body);

    res.status(201).json({
      mensaje: "Ruta creada correctamente",
      ruta
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear ruta",
      error: error.message
    });
  }
};

exports.obtenerRutas = async (req, res) => {
  try {
    const rutas = await Ruta.find({ estado: "activo" })
      .populate("lugares")
      .populate("creadoPor", "nombre email rol");

    res.json(rutas);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener rutas"
    });
  }
};

exports.obtenerRutaPorId = async (req, res) => {
  try {
    const ruta = await Ruta.findById(req.params.id)
      .populate("lugares")
      .populate("creadoPor", "nombre email rol");

    if (!ruta) {
      return res.status(404).json({
        mensaje: "Ruta no encontrada"
      });
    }

    res.json(ruta);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener ruta"
    });
  }
};

exports.actualizarRuta = async (req, res) => {
  try {
    const ruta = await Ruta.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!ruta) {
      return res.status(404).json({
        mensaje: "Ruta no encontrada"
      });
    }

    res.json({
      mensaje: "Ruta actualizada correctamente",
      ruta
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar ruta"
    });
  }
};

exports.eliminarRuta = async (req, res) => {
  try {
    const ruta = await Ruta.findByIdAndUpdate(
      req.params.id,
      { estado: "suspendido" },
      { new: true }
    );

    if (!ruta) {
      return res.status(404).json({
        mensaje: "Ruta no encontrada"
      });
    }

    res.json({
      mensaje: "Ruta suspendida correctamente",
      ruta
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al suspender ruta"
    });
  }
};
exports.generarRutaInteligente = async (req, res) => {
  try {
    const usuario = req.usuario;

    const {
      modo = "equilibrada",
      presupuestoMax = null,
      preferencias = [],
      evitar = [],
      duracionHoras = 4
    } = req.body;

    if (!usuario.perfilTipo) {
      return res.status(400).json({
        mensaje: "El usuario debe completar su perfilTipo antes de generar rutas"
      });
    }

    const ventana = await VentanaUsuario.findOne({
      usuario: usuario._id
    });

    const patronesRecientes = ventana ? ventana.patrones : [];

    const categoriasDisponibles =
      await obtenerCategoriasDisponibles();

    const patronesBloqueados = await PoolGlobal.find({
      bloqueado: true
    }).select("patron");

    const bloqueados = patronesBloqueados.map((p) => p.patron);

    const pools = await PoolGlobal.find({
      bloqueado: false
    });

    const patronAprendido =
      seleccionarPatronInteligente({
        pools,
        perfilTipo: usuario.perfilTipo
      });

    let patron = "";

    if (patronAprendido) {

      patron = patronAprendido.patron;

    } else {

      patron = generarPatronRuta({
        patronesRecientes,
        preferencias,
        evitar,
        modo,
        categoriasDisponibles
      });
    }

    let intentos = 0;

    while (bloqueados.includes(patron) && intentos < 20) {
      patron = generarPatronRuta({
        patronesRecientes,
        preferencias,
        evitar,
        modo,
        categoriasDisponibles
      });
      intentos++;
    }

    let rutaValida = false;
    let lugaresSeleccionados = [];
    let categorias = [];
    let resultadoFinal = null;

    for (let intentoRuta = 0; intentoRuta < 10; intentoRuta++) {
      categorias = patron.split("·");

      let cantidadObjetivo = 5;

      if (duracionHoras <= 2) {
        cantidadObjetivo = 3;
      } else if (duracionHoras <= 4) {
        cantidadObjetivo = 4;
      }

      categorias = categorias.slice(0, cantidadObjetivo);

      lugaresSeleccionados = [];

      let localAnterior = null;

      for (const categoria of categorias) {

        let candidatos = await Local.find({
          categoria,
          estado: "activo",
          _id: {
            $nin: lugaresSeleccionados.map(
              (item) => item.local._id
            )
          }
        });

        candidatos = candidatos.filter(
          (local) => localAbierto(local)
        );

        if (candidatos.length === 0) {
          continue;
        }

        let seleccionado = null;

        let mejorScore = Infinity;

        for (const candidato of candidatos) {

          let distancia = 0;

          if (localAnterior) {
            distancia = calcularDistancia(
              localAnterior.ubicacion.lat,
              localAnterior.ubicacion.lng,
              candidato.ubicacion.lat,
              candidato.ubicacion.lng
            );
          }

          const score = calcularScoreLocal(candidato, {
            modo,
            distancia,
            presupuestoMax
          });

          if (score < mejorScore) {
            mejorScore = score;
            seleccionado = candidato;
          }
        }

        if (seleccionado) {

          seleccionado.vecesUsado += 1;
          await seleccionado.save();

          lugaresSeleccionados.push({
            categoria,
            local: seleccionado
          });

          localAnterior = seleccionado;
        }
      }

      if (lugaresSeleccionados.length < cantidadObjetivo) {
        patron = generarPatronRuta({
          patronesRecientes,
          preferencias,
          evitar,
          modo,
          categoriasDisponibles
        });
        continue;
      }

      const duracionRealMinutos =
        calcularDuracionRuta(
          lugaresSeleccionados
        );

      const duracionRealHoras =
        (
          duracionRealMinutos / 60
        ).toFixed(1);

      const duracionMaximaMinutos = duracionHoras * 60;

      if (duracionRealMinutos > duracionMaximaMinutos) {
        continue;
      }

      rutaValida = true;

      resultadoFinal = {
        patron,
        categorias,
        lugaresSeleccionados,
        duracionRealMinutos,
        duracionRealHoras
      };

      break;
    }

    if (!resultadoFinal) {
      return res.status(400).json({
        mensaje: "No se pudo generar una ruta válida para el tiempo disponible"
      });
    }

    if (!rutaValida) {
      return res.status(400).json({
        mensaje: "No se pudo generar una ruta válida después de varios intentos",
        duracionSolicitadaHoras: duracionHoras
      });
    }

    await actualizarVentanaUsuario(usuario._id, patron);

    const linkGoogleMaps = generarLinkMaps(
      resultadoFinal.lugaresSeleccionados
    );

    const rutaGuardada = await Ruta.create({
      nombre: `Ruta ${resultadoFinal.patron}`,
      descripcion: "Ruta turística inteligente generada automáticamente.",
      tipoRuta: modo,
      zona: "Huehuetenango",
      lugares: resultadoFinal.lugaresSeleccionados.map(
        (item) => item.local._id
      ),
      distanciaTotal: 0,
      duracionEstimada: `${resultadoFinal.duracionRealHoras} horas`,
      precioEstimado: resultadoFinal.lugaresSeleccionados.reduce(
        (total, item) => total + (item.local.precioPromedio || 0),
        0
      ),
      dificultad: "baja",
      transporte: "mixto",
      linkGoogleMaps,
      estado: "activo",
      creadoPor: usuario._id
    });

    res.json({
      mensaje: "Ruta inteligente generada correctamente",
      perfilTipo: usuario.perfilTipo,
      patron: resultadoFinal.patron,
      categorias: resultadoFinal.categorias,
      duracionRealMinutos:
        resultadoFinal.duracionRealMinutos,
      duracionRealHoras:
        resultadoFinal.duracionRealHoras,

      ruta: resultadoFinal.lugaresSeleccionados.map((item, index) => ({
        orden: index + 1,
        categoria: item.categoria,
        local: item.local
      })),
      linkGoogleMaps,
      rutaGuardada
    });

  } catch (error) {

    res.status(500).json({
      mensaje: "Error al generar ruta inteligente",
      error: error.message
    });
  }
};

exports.generarCatalogo = async (req, res) => {
  try {
    const {
      tipo = "todas",
      duracion = "media",
      ubicacion = null
    } = req.body;

    const locales = await Local.find({
      estado: "activo",
      suscripcionActiva: true
    });

    if (locales.length < 3) {
      return res.status(400).json({
        mensaje: "No hay suficientes locales para generar rutas"
      });
    }

    const rutas = generarCatalogoRutas({
      locales,
      tipo,
      duracion,
      ubicacion
    });

    res.json({
      mensaje: "Catálogo generado correctamente",
      total: rutas.length,
      rutas
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al generar catálogo",
      error: error.message
    });
  }
};