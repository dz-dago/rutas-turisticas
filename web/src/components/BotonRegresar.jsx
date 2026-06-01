import { useNavigate } from "react-router-dom";

function BotonRegresar() {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className="mb-6 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white transition"
    >
      ← Regresar
    </button>
  );
}

export default BotonRegresar;
