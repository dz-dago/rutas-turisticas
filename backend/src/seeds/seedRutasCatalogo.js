require("dotenv").config();

const mongoose = require("mongoose");
const Ruta = require("../models/Ruta");
const Local = require("../models/Local");
const generarLinkMaps = require("../utils/generarLinkMaps");

async function seedRutasCatalogo() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongo conectado");

    const locales = await Local.find({ estado: "activo" });

    const buscar = (categoria) =>
      locales.find((local) => local.categoria === categoria);

    const crearRuta = async ({
      nombre,
      descripcion,
      tipoRuta,
      categorias,
      duracionEstimada,
      dificultad
    }) => {
      const lugares = categorias
        .map((categoria) => buscar(categoria))
        .filter(Boolean);

      if (lugares.length < 3) {
        console.log(`Ruta omitida por falta de lugares: ${nombre}`);
        return;
      }

      const lugaresFormato = lugares.map((local) => ({
        categoria: local.categoria,
        local
      }));

      const linkGoogleMaps = generarLinkMaps(lugaresFormato);

      const precioEstimado = lugares.reduce(
        (total, local) => total + (local.precioPromedio || 0),
        0
      );

      await Ruta.create({
        nombre,
        descripcion,
        tipoRuta,
        zona: "Huehuetenango",
        lugares: lugares.map((local) => local._id),
        distanciaTotal: 0,
        duracionEstimada,
        precioEstimado,
        dificultad,
        transporte: "mixto",
        linkGoogleMaps,
        estado: "activo",
        creadoPor: null
      });

      console.log(`Ruta creada: ${nombre}`);
    };

    await Ruta.deleteMany();

    await crearRuta({
      nombre: "Ruta Café, Cultura y Gastronomía",
      descripcion: "Recorrido ideal para iniciar con café, visitar un punto cultural y cerrar con gastronomía local.",
      tipoRuta: "equilibrada",
      categorias: ["CAF", "CUL", "GAS"],
      duracionEstimada: "3 horas",
      dificultad: "baja"
    });

    await crearRuta({
      nombre: "Ruta Natural y Relax",
      descripcion: "Ruta pensada para disfrutar espacios tranquilos, naturaleza y una experiencia relajada.",
      tipoRuta: "cercana",
      categorias: ["CAF", "NAT", "EXP", "GAS"],
      duracionEstimada: "4 horas",
      dificultad: "baja"
    });

    await crearRuta({
      nombre: "Ruta Gastronómica Local",
      descripcion: "Experiencia enfocada en restaurantes y sabores locales de Huehuetenango.",
      tipoRuta: "economica",
      categorias: ["CAF", "GAS", "GAS"],
      duracionEstimada: "2 horas",
      dificultad: "baja"
    });

    await crearRuta({
      nombre: "Ruta Cultural Completa",
      descripcion: "Recorrido para conocer puntos culturales, experiencias locales y gastronomía.",
      tipoRuta: "mejor_calificada",
      categorias: ["CAF", "CUL", "EXP", "GAS"],
      duracionEstimada: "4 horas",
      dificultad: "media"
    });

    console.log("Seed de rutas terminado");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seedRutasCatalogo();