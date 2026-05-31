const lugaresRoutes = require("./routes/lugares.routes");
const rutasRoutes = require("./routes/rutas.routes");
const authRoutes = require("./routes/auth.routes");
const guiasRoutes = require("./routes/guias.routes");
const eventosRoutes = require("./routes/eventos.routes");
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const poolRoutes = require("./routes/pool.routes");
const path = require("path");
const uploadRoutes = require("./routes/upload.routes");

require("./config/passport");

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());
app.use(passport.initialize());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api/upload", uploadRoutes);

app.use("/api/pool", poolRoutes);

app.get("/", (req, res) => {
  res.json({
    mensaje: "API de rutas turísticas funcionando correctamente"
  });
});

app.use("/api/auth", authRoutes);

app.use("/api/rutas", rutasRoutes);

app.use("/api/guias", guiasRoutes);

app.use("/api/locales", lugaresRoutes);

app.use("/api/eventos", eventosRoutes);

module.exports = app;