import React, { useState, useEffect } from "react";
import axios from "axios";
import API from "../api/axiosConfig";
import CardPista from "../components/CardPista";
import { Search, Filter } from "lucide-react";
import "../styles/Pistas.css";

const FALLBACK_API_URL =
  import.meta.env.VITE_API_FALLBACK_URL ||
  "https://mara-production-7e59.up.railway.app/api";

const normalizePistasResponse = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.pistas)) return payload.pistas;
  return [];
};

export default function Pistas() {
  const [pistas, setPistas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorDetails, setErrorDetails] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDeporte, setFilterDeporte] = useState("Todos");

  useEffect(() => {
    fetchPistas();
  }, []);

  const fetchPistas = async () => {
    setError(null);
    setErrorDetails("");

    const attempts = [
      () => API.get("/pistas", { params: { limit: 100 } }),
      () => API.get("/pistas", { params: { all: true } }),
      () => API.get("/pistas"),
      () => axios.get(`${FALLBACK_API_URL}/pistas`, { params: { limit: 100 }, withCredentials: true }),
      () => axios.get(`${FALLBACK_API_URL}/pistas`, { params: { all: true }, withCredentials: true }),
    ];

    try {
      setLoading(true);
      for (const attempt of attempts) {
        try {
          const res = await attempt();
          const pistasData = normalizePistasResponse(res.data);
          if (pistasData.length > 0) {
            setPistas(pistasData);
            return;
          }
        } catch {
          // Keep trying fallback endpoints.
        }
      }

      throw new Error("No se pudo obtener la lista de pistas desde ningún endpoint.");
    } catch (err) {
      console.error("Error fetching pistas:", err);
      setError("No se pudieron cargar las pistas. Intenta de nuevo en unos segundos.");
      setErrorDetails(err?.response?.data?.msg || err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const filteredPistas = pistas.filter((pista) => {
    const matchesSearch = pista.nombre
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDeporte =
      filterDeporte === "Todos" || pista.deporte === filterDeporte;
    return matchesSearch && matchesDeporte;
  });

  const deportes = ["Todos", ...new Set(pistas.map((p) => p.deporte))];

  return (
    <div className="pistas-page">
      <div className="container">
        <div className="pistas-header">
          <h1 className="pistas-title">Reserva tu Pista</h1>
          <p className="pistas-subtitle">
            Encuentra y reserva las mejores instalaciones deportivas de tu
            ciudad
          </p>
        </div>

        <div className="filters-container">
          <div className="search-wrapper">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filters-wrapper">
            <Filter size={20} className="filter-icon" />
            {deportes.map((deporte) => (
              <button
                key={deporte}
                onClick={() => setFilterDeporte(deporte)}
                className={`filter-btn ${
                  filterDeporte === deporte ? "active" : "inactive"
                }`}
              >
                {deporte}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="pistas-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardPista key={i} loading />
            ))}
          </div>
        ) : error ? (
          <div className="error-container">
            <p>{error}</p>
            {errorDetails && <small>{errorDetails}</small>}
            <button onClick={fetchPistas} className="btn-clear" style={{ marginTop: "1rem" }}>
              Reintentar carga
            </button>
          </div>
        ) : filteredPistas.length > 0 ? (
          <div className="pistas-grid">
            {filteredPistas.map((pista) => (
              <CardPista key={pista._id} pista={pista} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p className="empty-text">
              No se encontraron pistas con esos criterios.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterDeporte("Todos");
              }}
              className="btn-clear"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
