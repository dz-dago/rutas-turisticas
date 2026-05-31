require("dotenv").config();

const mongoose = require("mongoose");
const Local = require("../models/Local");

const lugaresHuehuetenango = [
  // 15 CAFETERÍAS
  { nombre: "Café La Tinaja", categoria: "CAF", descripcion: "Cafetería tradicional con ambiente local y comida guatemalteca.", imagen: "/img/lugares/cafe-la-tinaja.jpg", latitud: 15.3191, longitud: -91.4718, precioPromedio: 65 },
  { nombre: "Pastelería Monte Alto", categoria: "CAF", descripcion: "Cafetería y pastelería reconocida para postres, café y reuniones.", imagen: "/img/lugares/monte-alto.jpg", latitud: 15.3185, longitud: -91.4726, precioPromedio: 60 },
  { nombre: "Cafetería Doña Estercita", categoria: "CAF", descripcion: "Cafetería local con antojitos, desayunos y atención familiar.", imagen: "/img/lugares/dona-estercita.jpg", latitud: 15.3169, longitud: -91.4752, precioPromedio: 45 },
  { nombre: "Cafetería La Tacita de Plata", categoria: "CAF", descripcion: "Café céntrico con propuesta sencilla para bebidas calientes y refacciones.", imagen: "/img/lugares/la-tacita-de-plata.jpg", latitud: 15.3197, longitud: -91.4735, precioPromedio: 45 },
  { nombre: "Cafetería Carilo", categoria: "CAF", descripcion: "Espacio de café y postres para visita rápida en la ciudad.", imagen: "/img/lugares/cafeteria-carilo.jpg", latitud: 15.3212, longitud: -91.4721, precioPromedio: 50 },
  { nombre: "Calma Café Parque Salvador Osorio", categoria: "CAF", descripcion: "Café cercano a parque, ideal para descanso y conversación.", imagen: "/img/lugares/calma-cafe.jpg", latitud: 15.3184, longitud: -91.4749, precioPromedio: 55 },
  { nombre: "Café Don Gil", categoria: "CAF", descripcion: "Cafetería con enfoque local y ambiente tranquilo.", imagen: "/img/lugares/cafe-don-gil.jpg", latitud: 15.3263, longitud: -91.4698, precioPromedio: 55 },
  { nombre: "Café Barista Huehuetenango", categoria: "CAF", descripcion: "Cafetería moderna para café, postres y reuniones informales.", imagen: "/img/lugares/barista-huehue.jpg", latitud: 15.3218, longitud: -91.4699, precioPromedio: 70 },
  { nombre: "Café San Rafael", categoria: "CAF", descripcion: "Café local con bebidas calientes y repostería básica.", imagen: "/img/lugares/cafe-san-rafael.jpg", latitud: 15.3172, longitud: -91.4707, precioPromedio: 45 },
  { nombre: "Café Cuchumatanes", categoria: "CAF", descripcion: "Cafetería inspirada en el ambiente de montaña huehueteco.", imagen: "/img/lugares/cafe-cuchumatanes.jpg", latitud: 15.3241, longitud: -91.4759, precioPromedio: 50 },
  { nombre: "Café Central Huehue", categoria: "CAF", descripcion: "Punto céntrico para café, pan dulce y refacciones.", imagen: "/img/lugares/cafe-central.jpg", latitud: 15.3192, longitud: -91.4708, precioPromedio: 45 },
  { nombre: "Café La Estación", categoria: "CAF", descripcion: "Cafetería urbana para desayunos rápidos y bebidas frías.", imagen: "/img/lugares/cafe-la-estacion.jpg", latitud: 15.3156, longitud: -91.4734, precioPromedio: 50 },
  { nombre: "Café del Parque", categoria: "CAF", descripcion: "Cafetería cercana al centro histórico y zonas de paseo.", imagen: "/img/lugares/cafe-del-parque.jpg", latitud: 15.3196, longitud: -91.4715, precioPromedio: 50 },
  { nombre: "Café Colonial Huehuetenango", categoria: "CAF", descripcion: "Café de estilo tranquilo para descanso en ruta urbana.", imagen: "/img/lugares/cafe-colonial.jpg", latitud: 15.3189, longitud: -91.4761, precioPromedio: 55 },
  { nombre: "Café Aroma Huehue", categoria: "CAF", descripcion: "Cafetería para bebidas calientes, frías y postres sencillos.", imagen: "/img/lugares/cafe-aroma.jpg", latitud: 15.3225, longitud: -91.4716, precioPromedio: 50 },

  // 15 RESTAURANTES
  { nombre: "La Fonda de Don Juan", categoria: "GAS", descripcion: "Restaurante de comida tradicional y ambiente familiar.", imagen: "/img/lugares/la-fonda-de-don-juan.jpg", latitud: 15.3199, longitud: -91.4722, precioPromedio: 85 },
  { nombre: "Restaurante El Jardín", categoria: "GAS", descripcion: "Restaurante familiar con menú variado y ambiente tranquilo.", imagen: "/img/lugares/restaurante-el-jardin.jpg", latitud: 15.3214, longitud: -91.4706, precioPromedio: 90 },
  { nombre: "Al Pomodoro Ristorante", categoria: "GAS", descripcion: "Restaurante italiano reconocido por pizza, pasta y ambiente casual.", imagen: "/img/lugares/al-pomodoro.jpg", latitud: 15.3206, longitud: -91.4697, precioPromedio: 110 },
  { nombre: "Restaurante La Galera", categoria: "GAS", descripcion: "Restaurante local de comida variada y platos fuertes.", imagen: "/img/lugares/la-galera.jpg", latitud: 15.3176, longitud: -91.4771, precioPromedio: 85 },
  { nombre: "La Criolla", categoria: "GAS", descripcion: "Restaurante de comida típica y platos caseros.", imagen: "/img/lugares/la-criolla.jpg", latitud: 15.3182, longitud: -91.4729, precioPromedio: 75 },
  { nombre: "La Escondida Steak House", categoria: "GAS", descripcion: "Restaurante especializado en carnes y comida formal.", imagen: "/img/lugares/la-escondida-steak-house.jpg", latitud: 15.3238, longitud: -91.4702, precioPromedio: 135 },
  { nombre: "Las Palmeras", categoria: "GAS", descripcion: "Restaurante familiar con menú popular y ambiente amplio.", imagen: "/img/lugares/las-palmeras.jpg", latitud: 15.3167, longitud: -91.4794, precioPromedio: 80 },
  { nombre: "La Pizza Hogareña", categoria: "GAS", descripcion: "Pizzería local con opciones familiares y servicio casual.", imagen: "/img/lugares/la-pizza-hogarena.jpg", latitud: 15.3202, longitud: -91.4754, precioPromedio: 75 },
  { nombre: "Domino's Express Huehue Centro", categoria: "GAS", descripcion: "Pizzería de comida rápida ubicada en zona céntrica.", imagen: "/img/lugares/dominos-huehue.jpg", latitud: 15.3194, longitud: -91.4711, precioPromedio: 85 },
  { nombre: "Pizzería Sesiliana", categoria: "GAS", descripcion: "Pizzería local para comida rápida y reuniones informales.", imagen: "/img/lugares/pizzeria-sesiliana.jpg", latitud: 15.3217, longitud: -91.4742, precioPromedio: 70 },
  { nombre: "Chicharrones y Súper Carnitas Mi Cochinito", categoria: "GAS", descripcion: "Comida popular especializada en carnitas y chicharrones.", imagen: "/img/lugares/mi-cochinito.jpg", latitud: 15.3163, longitud: -91.4728, precioPromedio: 65 },
  { nombre: "Restaurante La Esquina del Sabor", categoria: "GAS", descripcion: "Restaurante de comida casera y platos económicos.", imagen: "/img/lugares/la-esquina-del-sabor.jpg", latitud: 15.3209, longitud: -91.4762, precioPromedio: 60 },
  { nombre: "Restaurante Casa Brava", categoria: "GAS", descripcion: "Restaurante recomendado para almuerzos, pizzas y platos variados.", imagen: "/img/lugares/casa-brava.jpg", latitud: 15.3229, longitud: -91.4691, precioPromedio: 95 },
  { nombre: "Pollo Campero Huehuetenango", categoria: "GAS", descripcion: "Restaurante familiar de comida rápida guatemalteca.", imagen: "/img/lugares/campero-huehue.jpg", latitud: 15.3195, longitud: -91.4704, precioPromedio: 65 },
  { nombre: "Restaurante Los Cebollines Huehuetenango", categoria: "GAS", descripcion: "Restaurante de comida mexicana y familiar.", imagen: "/img/lugares/los-cebollines-huehue.jpg", latitud: 15.3251, longitud: -91.4675, precioPromedio: 115 },

  // 10 MIRADORES / PARQUES
  { nombre: "Parque La Unión", categoria: "NAT", descripcion: "Parque céntrico junto a la Catedral, útil como punto de encuentro.", imagen: "/img/lugares/parque-la-union.jpg", latitud: 15.3193, longitud: -91.4714, precioPromedio: 0 },
  { nombre: "Parque Salvador Osorio", categoria: "NAT", descripcion: "Parque urbano para descanso, paseo y convivencia local.", imagen: "/img/lugares/parque-salvador-osorio.jpg", latitud: 15.3181, longitud: -91.4751, precioPromedio: 0 },
  { nombre: "Parque El Calvario", categoria: "NAT", descripcion: "Espacio urbano tradicional vinculado al recorrido religioso y local.", imagen: "/img/lugares/parque-el-calvario.jpg", latitud: 15.3158, longitud: -91.4745, precioPromedio: 0 },
  { nombre: "Plaza de Armas de Huehuetenango", categoria: "NAT", descripcion: "Plaza central histórica para caminar y observar arquitectura local.", imagen: "/img/lugares/plaza-de-armas.jpg", latitud: 15.3195, longitud: -91.4712, precioPromedio: 0 },
  { nombre: "Mirador Juan Diéguez Olaverri", categoria: "NAT", descripcion: "Mirador emblemático de los Cuchumatanes con vista panorámica.", imagen: "/img/lugares/mirador-juan-dieguez-olaverri.jpg", latitud: 15.4108, longitud: -91.4477, precioPromedio: 10 },
  { nombre: "Mirador Los Cuchumatanes", categoria: "NAT", descripcion: "Punto natural de observación hacia montañas y paisaje frío.", imagen: "/img/lugares/mirador-cuchumatanes.jpg", latitud: 15.4046, longitud: -91.4539, precioPromedio: 10 },
  { nombre: "Laguna Magdalena", categoria: "NAT", descripcion: "Destino natural de montaña con laguna y paisaje escénico.", imagen: "/img/lugares/laguna-magdalena.jpg", latitud: 15.5628, longitud: -91.5058, precioPromedio: 25 },
  { nombre: "Nacimiento del Río San Juan", categoria: "NAT", descripcion: "Área natural con agua fría, paisaje y visita recreativa.", imagen: "/img/lugares/nacimiento-rio-san-juan.jpg", latitud: 15.3604, longitud: -91.4491, precioPromedio: 15 },
  { nombre: "Parque Central de Chiantla", categoria: "NAT", descripcion: "Parque municipal cercano a Huehuetenango con ambiente local.", imagen: "/img/lugares/parque-central-chiantla.jpg", latitud: 15.3549, longitud: -91.4583, precioPromedio: 0 },
  { nombre: "Mirador La Torre Chiantla", categoria: "NAT", descripcion: "Zona de vista panorámica hacia el valle y montañas cercanas.", imagen: "/img/lugares/mirador-la-torre.jpg", latitud: 15.3675, longitud: -91.4488, precioPromedio: 10 },

  // 10 CULTURALES / HISTÓRICOS
  { nombre: "Catedral Templo de La Inmaculada Concepción", categoria: "CUL", descripcion: "Templo principal del centro histórico de Huehuetenango.", imagen: "/img/lugares/catedral-inmaculada-concepcion.jpg", latitud: 15.3192, longitud: -91.4717, precioPromedio: 0 },
  { nombre: "Teatro Municipal José Ernesto Monzón", categoria: "CUL", descripcion: "Teatro histórico y centro cultural representativo de la ciudad.", imagen: "/img/lugares/teatro-municipal-jose-ernesto-monzon.jpg", latitud: 15.3197, longitud: -91.4724, precioPromedio: 20 },
  { nombre: "Municipalidad de Huehuetenango", categoria: "CUL", descripcion: "Edificio institucional del centro histórico con valor urbano.", imagen: "/img/lugares/municipalidad-huehuetenango.jpg", latitud: 15.3196, longitud: -91.4710, precioPromedio: 0 },
  { nombre: "Gobernación Departamental de Huehuetenango", categoria: "CUL", descripcion: "Edificio histórico cercano a la plaza central.", imagen: "/img/lugares/gobernacion-departamental.jpg", latitud: 15.3198, longitud: -91.4709, precioPromedio: 0 },
  { nombre: "Concha Acústica de Huehuetenango", categoria: "CUL", descripcion: "Espacio cultural usado para actividades públicas y presentaciones.", imagen: "/img/lugares/concha-acustica.jpg", latitud: 15.3194, longitud: -91.4710, precioPromedio: 0 },
  { nombre: "Casa Santiago Miller", categoria: "CUL", descripcion: "Casa cultural vinculada al patrimonio urbano huehueteco.", imagen: "/img/lugares/casa-santiago-miller.jpg", latitud: 15.3201, longitud: -91.4728, precioPromedio: 0 },
  { nombre: "Museo del Café Huehuetenango", categoria: "CUL", descripcion: "Espacio relacionado con la tradición cafetalera regional.", imagen: "/img/lugares/museo-del-cafe.jpg", latitud: 15.3222, longitud: -91.4689, precioPromedio: 20 },
  { nombre: "Sitio Arqueológico Zaculeu", categoria: "HIS", descripcion: "Antigua ciudad Mam y uno de los sitios históricos más importantes del área.", imagen: "/img/lugares/zaculeu.jpg", latitud: 15.3336, longitud: -91.5092, precioPromedio: 50 },
  { nombre: "Iglesia El Calvario", categoria: "REL", descripcion: "Templo tradicional asociado al sector de El Calvario.", imagen: "/img/lugares/iglesia-el-calvario.jpg", latitud: 15.3155, longitud: -91.4742, precioPromedio: 0 },
  { nombre: "Mercado Municipal de Huehuetenango", categoria: "EXP", descripcion: "Mercado tradicional para conocer comercio local y productos típicos.", imagen: "/img/lugares/mercado-municipal.jpg", latitud: 15.3187, longitud: -91.4703, precioPromedio: 35 },

  // 5 ENTRETENIMIENTO
  { nombre: "Bistro 5 Sentidos", categoria: "ENT", descripcion: "Lugar social para comida, bebidas y convivencia nocturna moderada.", imagen: "/img/lugares/bistro-5-sentidos.jpg", latitud: 15.3221, longitud: -91.4719, precioPromedio: 100 },
  { nombre: "Casa Blanca Restaurante y Eventos", categoria: "ENT", descripcion: "Espacio para eventos, reuniones familiares y actividades sociales.", imagen: "/img/lugares/casa-blanca-eventos.jpg", latitud: 15.3257, longitud: -91.4696, precioPromedio: 120 },
  { nombre: "Centro Comercial Pradera Huehuetenango", categoria: "ENT", descripcion: "Centro comercial con tiendas, comida y entretenimiento urbano.", imagen: "/img/lugares/pradera-huehuetenango.jpg", latitud: 15.3248, longitud: -91.4666, precioPromedio: 75 },
  { nombre: "Centro Comercial Concepción", categoria: "ENT", descripcion: "Área comercial céntrica para compras, comida y paseo casual.", imagen: "/img/lugares/centro-comercial-concepcion.jpg", latitud: 15.3205, longitud: -91.4702, precioPromedio: 60 },
  { nombre: "Madero Plaza", categoria: "ENT", descripcion: "Plaza comercial con locales, comida y actividad urbana.", imagen: "/img/lugares/madero-plaza.jpg", latitud: 15.3234, longitud: -91.4681, precioPromedio: 70 }
];

const horarioBase = {
  lunes: "08:00 - 20:00",
  martes: "08:00 - 20:00",
  miercoles: "08:00 - 20:00",
  jueves: "08:00 - 20:00",
  viernes: "08:00 - 20:00",
  sabado: "08:00 - 18:00",
  domingo: "cerrado"
};

const adaptarLocales = lugaresHuehuetenango.map((lugar) => ({
  nombre: lugar.nombre,
  categoria: lugar.categoria,
  descripcion: lugar.descripcion,

  ubicacion: {
    lat: lugar.latitud,
    lng: lugar.longitud,
    direccion: "Huehuetenango"
  },

  fotos: [lugar.imagen],

  horario: horarioBase,

  precioPromedio: lugar.precioPromedio || 0,

  rating: Number((Math.random() * (5 - 4.2) + 4.2).toFixed(2)),
  totalResenas: Math.floor(Math.random() * 150) + 20,

  confianza: 0,
  creadoPor: null,

  estado: "activo",
  suscripcionActiva: true
}));

async function seedLocales() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Mongo conectado");

    await Local.deleteMany({ creadoPor: null });

    await Local.insertMany(adaptarLocales);

    console.log(`Locales insertados: ${adaptarLocales.length}`);

    process.exit(0);
  } catch (error) {
    console.error("Error al insertar locales:", error);
    process.exit(1);
  }
}

seedLocales();
