import React, { useState } from "react";
import api from "../api/api";

function PruebaUpload() {
  const [imagen, setImagen] = useState(null);
  const [url, setUrl] = useState("");

  const subirImagen = async () => {
    const formData = new FormData();

    formData.append("imagen", imagen);

    const res = await api.post("/upload/imagen", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    setUrl(res.data.url);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Prueba Upload</h1>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImagen(e.target.files[0])}
      />

      <button onClick={subirImagen}>
        Subir
      </button>

      {url && (
        <>
          <p>{url}</p>
          <img src={url} alt="subida" width="300" />
        </>
      )}
    </div>
  );
}

export default PruebaUpload;
