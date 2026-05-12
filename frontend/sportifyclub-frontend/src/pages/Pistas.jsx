import React, { useState, useEffect } from "react";
import API from "../api/axiosConfig";
import CardPista from "../components/CardPista";
import { Search, Filter } from "lucide-react";
import "../styles/Pistas.css";

export default function Pistas() {
  const [pistas, setPistas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDeporte, setFilterDeporte] = useState("Todos");

  useEffect(() => {
    fetchPistas();
  }, []);

  const fetchPistas = async () => {
    try {
      setLoading(true);
      const res = await API.get("/pistas?limit=100");
      setPistas(res.data.pistas);
    } catch (err) {
      console.error("Error fetching pistas:", err);
      setError("No se pudieron cargar las pistas");
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
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        ) : error ? (
          <div className="error-container">{error}</div>
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
