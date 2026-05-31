require("dotenv").config();

const mongoose = require("mongoose");
const Local = require("../models/Local");

const ubicacionBase = {
  lat: 15.319,
  lng: -91.471,
  direccion: "Huehuetenango"
};

const horarioBase = {
  lunes: "08:00 - 20:00",
  martes: "08:00 - 20:00",
  miercoles: "08:00 - 20:00",
  jueves: "08:00 - 20:00",
  viernes: "08:00 - 20:00",
  sabado: "08:00 - 18:00",
  domingo: "cerrado"
};

const locales = [
  {
    nombre: "Catedral Templo de La Inmaculada Concepción",
    categoria: "CUL",
    descripcion: "Lugar turístico y cultural en Huehuetenango.",
    ubicacion: ubicacionBase,
    fotos: [],
    horario: horarioBase,
    precioPromedio: 0,
    rating: 0,
    totalResenas: 0,
    confianza: 0,
    creadoPor: null,
    estado: "activo"
  },
  {
    nombre: "Teatro Municipal José Ernesto Monzón",
    categoria: "ENT",
    descripcion: "Espacio de entretenimiento y eventos culturales.",
    ubicacion: ubicacionBase,
    fotos: [],
    horario: horarioBase,
    precioPromedio: 0,
    rating: 0,
    totalResenas: 0,
    confianza: 0,
    creadoPor: null,
    estado: "activo"
  },
  {
    nombre: "La Fonda de Don Juan",
    categoria: "GAS",
    descripcion: "Local gastronómico.",
    ubicacion: ubicacionBase,
    fotos: [],
    horario: horarioBase,
    precioPromedio: 60,
    rating: 0,
    totalResenas: 0,
    confianza: 0,
    creadoPor: null,
    estado: "activo"
  },
  {
    nombre: "Restaurante El Jardín",
    categoria: "GAS",
    descripcion: "Restaurante de gastronomía local.",
    ubicacion: ubicacionBase,
    fotos: [],
    horario: horarioBase,
    precioPromedio: 60,
    rating: 0,
    totalResenas: 0,
    confianza: 0,
    creadoPor: null,
    estado: "activo"
  },
  {
    nombre: "Café La Tinaja",
    categoria: "CAF",
    descripcion: "Cafetería y postres.",
    ubicacion: ubicacionBase,
    fotos: [],
    horario: horarioBase,
    precioPromedio: 40,
    rating: 0,
    totalResenas: 0,
    confianza: 0,
    creadoPor: null,
    estado: "activo"
  },
  {
    nombre: "Monte Alto",
    categoria: "CAF",
    descripcion: "Cafetería y postres.",
    ubicacion: ubicacionBase,
    fotos: [],
    horario: horarioBase,
    precioPromedio: 40,
    rating: 0,
    totalResenas: 0,
    confianza: 0,
    creadoPor: null,
    estado: "activo"
  },
  {
    nombre: "El Pomodoro",
    categoria: "GAS",
    descripcion: "Local gastronómico.",
    ubicacion: ubicacionBase,
    fotos: [],
    horario: horarioBase,
    precioPromedio: 65,
    rating: 0,
    totalResenas: 0,
    confianza: 0,
    creadoPor: null,
    estado: "activo"
  },
  {
    nombre: "Lekaf",
    categoria: "EXP",
    descripcion: "Lugar de experiencias y relax.",
    ubicacion: ubicacionBase,
    fotos: [],
    horario: horarioBase,
    precioPromedio: 50,
    rating: 0,
    totalResenas: 0,
    confianza: 0,
    creadoPor: null,
    estado: "activo"
  },
  {
    nombre: "Doña Estercita",
    categoria: "CAF",
    descripcion: "Cafetería y postres.",
    ubicacion: ubicacionBase,
    fotos: [],
    horario: horarioBase,
    precioPromedio: 35,
    rating: 0,
    totalResenas: 0,
    confianza: 0,
    creadoPor: null,
    estado: "activo"
  },
  {
    nombre: "Terraza Catedral",
    categoria: "EXP",
    descripcion: "Lugar de experiencia y relax.",
    ubicacion: ubicacionBase,
    fotos: [],
    horario: horarioBase,
    precioPromedio: 50,
    rating: 0,
    totalResenas: 0,
    confianza: 0,
    creadoPor: null,
    estado: "activo"
  },
  {
    nombre: "La Galera",
    categoria: "GAS",
    descripcion: "Local gastronómico.",
    ubicacion: ubicacionBase,
    fotos: [],
    horario: horarioBase,
    precioPromedio: 55,
    rating: 0,
    totalResenas: 0,
    confianza: 0,
    creadoPor: null,
    estado: "activo"
  },
  {
    nombre: "Parque La Unión",
    categoria: "NAT",
    descripcion: "Parque y espacio natural.",
    ubicacion: ubicacionBase,
    fotos: [],
    horario: horarioBase,
    precioPromedio: 0,
    rating: 0,
    totalResenas: 0,
    confianza: 0,
    creadoPor: null,
    estado: "activo"
  },
  {
    nombre: "Hotel Zaculeu",
    categoria: "HOS",
    descripcion: "Hospedaje.",
    ubicacion: ubicacionBase,
    fotos: [],
    horario: horarioBase,
    precioPromedio: 250,
    rating: 0,
    totalResenas: 0,
    confianza: 0,
    creadoPor: null,
    estado: "activo"
  },
  {
    nombre: "La Criolla",
    categoria: "GAS",
    descripcion: "Local gastronómico.",
    ubicacion: ubicacionBase,
    fotos: [],
    horario: horarioBase,
    precioPromedio: 55,
    rating: 0,
    totalResenas: 0,
    confianza: 0,
    creadoPor: null,
    estado: "activo"
  },
  {
    nombre: "Restaurante La Escondida Steak House",
    categoria: "GAS",
    descripcion: "Restaurante especializado en carnes.",
    ubicacion: ubicacionBase,
    fotos: [],
    horario: horarioBase,
    precioPromedio: 90,
    rating: 0,
    totalResenas: 0,
    confianza: 0,
    creadoPor: null,
    estado: "activo"
  }
];

async function seedLocales() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Mongo conectado");

    await Local.deleteMany();

    console.log("Locales anteriores eliminados");

    await Local.insertMany(locales);

    console.log("Locales insertados correctamente");

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seedLocales();  