import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Registro from "./pages/Registro";
import PruebaUpload from "./pages/PruebaUpload";
import AuthSuccess from "./pages/AuthSuccess";
import CompletarPerfil from "./pages/CompletarPerfil";
import Turista from "./pages/Turista";
import Guia from "./pages/Guia";
import Negocio from "./pages/Negocio";
import GuiasTuristicos from "./pages/GuiasTuristicos";
import ExplorarLocales from "./pages/ExplorarLocales";
import Perfil from "./pages/Perfil";
import PerfilGuia from "./pages/PerfilGuia";
import DashboardGuia from "./pages/DashboardGuia";
import SuscripcionGuia from "./pages/SuscripcionGuia";
import PanelPropietario from "./pages/PanelPropietario";
import AgregarLocal from "./pages/AgregarLocal";
import MisLocales from "./pages/MisLocales";
import SuscripcionesLocales from "./pages/SuscripcionesLocales";
import Landing from "./pages/Landing";
import DetalleRuta from "./pages/DetalleRuta";
import PanelAdmin from "./pages/PanelAdmin";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/prueba-upload" element={<PruebaUpload />} />
          <Route path="/auth/success" element={<AuthSuccess />} />

          <Route
            path="/completar-perfil"
            element={
              <ProtectedRoute>
                <CompletarPerfil />
              </ProtectedRoute>
            }
          />

          <Route
            path="/turista"
            element={
              <ProtectedRoute>
                <Turista />
              </ProtectedRoute>
            }
          />

          <Route
            path="/guia"
            element={
              <ProtectedRoute>
                <DashboardGuia />
              </ProtectedRoute>
            }
          />

          <Route
            path="/guia/perfil"
            element={
              <ProtectedRoute>
                <PerfilGuia />
              </ProtectedRoute>
            }
          />

          <Route
            path="/guia/suscripcion"
            element={
              <ProtectedRoute>
                <SuscripcionGuia />
              </ProtectedRoute>
            }
          />

          <Route
            path="/propietario"
            element={
              <ProtectedRoute>
                <PanelPropietario />
              </ProtectedRoute>
            }
          />

          <Route
            path="/propietario/agregar-local"
            element={
              <ProtectedRoute>
                <AgregarLocal />
              </ProtectedRoute>
            }
          />

          <Route
            path="/propietario/locales"
            element={
              <ProtectedRoute>
                <MisLocales />
              </ProtectedRoute>
            }
          />

          <Route
            path="/propietario/suscripciones"
            element={
              <ProtectedRoute>
                <SuscripcionesLocales />
              </ProtectedRoute>
            }
          />

          <Route
            path="/local"
            element={
              <ProtectedRoute>
                <Negocio />
              </ProtectedRoute>
            }
          />

          <Route
            path="/guias-turisticos"
            element={
              <ProtectedRoute>
                <GuiasTuristicos />
              </ProtectedRoute>
            }
          />

          <Route
            path="/explorar-locales"
            element={
              <ProtectedRoute>
                <ExplorarLocales />
              </ProtectedRoute>
            }
          />

          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <Perfil />
              </ProtectedRoute>
            }
          />

          <Route
            path="/rutas/:id"
            element={
              <ProtectedRoute>
                <DetalleRuta />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ruta-detalle"
            element={
              <ProtectedRoute>
                <DetalleRuta />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["admin"]}>
                <PanelAdmin />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;