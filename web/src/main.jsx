import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";

import App from "./App";

import "./styles/global.css";
import "leaflet/dist/leaflet.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />

    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "#102033",
          color: "#fff",
          border: "1px solid #1D3550"
        },
        success: {
          iconTheme: {
            primary: "#2CB1BC",
            secondary: "#fff"
          }
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#fff"
          }
        }
      }}
    />
  </React.StrictMode>
);