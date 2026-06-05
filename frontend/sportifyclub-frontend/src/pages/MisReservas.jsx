import { useAuth } from "../hooks/useAuth";
import { useReservas } from "../context/ReservaContext";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/MisReservas.css";

export default function MisReservas() {
  const { user } = useAuth();

  const {
    reservas,
    loading,
    error,
    fetchReservas,
    updateReserva,
    deleteReserva,
    filterByStatus,
    sortReservas,
    resetFilters,
    filters,
  } = useReservas();

  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    fetchReservas();
  }, [fetchReservas]);

  const handleFilterChange = (status) => {
    setSelectedFilter(status);
    filterByStatus(status);
  };

  const handleSortChange = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);
    sortReservas("fecha", newOrder);
  };

  const handleCancelReserva = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres cancelar esta reserva?")) {
      const result = await deleteReserva(id);
      if (result.success) {
        alert("Reserva cancelada exitosamente");
      } else {
        alert(result.error || "Error al cancelar la reserva");
      }
    }
  };

  const handleConfirmReserva = async (id) => {
    const result = await updateReserva(id, { estado: "confirmada" });
    if (result.success) {
      alert("Reserva confirmada correctamente");
    } else {
      alert(result.error || "Error al confirmar la reserva");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="mis-reservas-page">
        <div className="loading-container">
          <p>Cargando reservas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mis-reservas-page">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={fetchReservas} className="btn-retry">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mis-reservas-page">
      <div className="mis-reservas-container">
        <div className="reservas-header">
          <h1 className="reservas-title">Mis Reservas</h1>
          <p className="reservas-subtitle">
            ¡Hola, {user?.name || user?.email}! Aquí tienes todas tus reservas
          </p>
        </div>

        {reservas.length > 0 && (
          <div className="reservas-controls">
            <div className="filter-buttons">
              <button
                className={`filter-btn ${
                  selectedFilter === "all" ? "active" : ""
                }`}
                onClick={() => handleFilterChange("all")}
              >
                Todas
              </button>
              <button
                className={`filter-btn ${
                  selectedFilter === "confirmada" ? "active" : ""
                }`}
                onClick={() => handleFilterChange("confirmada")}
              >
                Confirmadas
              </button>
              <button
                className={`filter-btn ${
                  selectedFilter === "cancelada" ? "active" : ""
                }`}
                onClick={() => handleFilterChange("cancelada")}
              >
                Canceladas
              </button>
            </div>

            <div className="sort-controls">
              <button onClick={handleSortChange} className="sort-btn">
                Ordenar por fecha {sortOrder === "asc" ? "↑" : "↓"}
              </button>
              {filters.status !== "all" && (
                <button onClick={resetFilters} className="reset-btn">
                  Limpiar filtros
                </button>
              )}
            </div>
          </div>
        )}

        {reservas.length === 0 ? (
          <div className="reservas-empty">
            <p className="empty-icon">🎾</p>
            <h3 className="empty-title">
              {filters.status !== "all"
                ? `No tienes reservas ${filters.status}s`
                : "Aún no tienes reservas"}
            </h3>
            <p className="empty-desc">
              {filters.status !== "all" ? (
                <button onClick={resetFilters} className="btn-search">
                  Ver todas las reservas
                </button>
              ) : (
                <>
                  ¡Es hora de reservar tu primera pista!
                  <Link to="/pistas" className="btn-search">
                    Buscar pistas
                  </Link>
                </>
              )}
            </p>
          </div>
        ) : (
          <div className="reservas-grid">
            {reservas.map((reserva) => (
              <div key={reserva._id} className="reserva-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img 
                    src={(() => {
                      const defaultImages = {
                        pádel: "/fallback-ball.svg",
                        tenis: "/fallback-ball.svg",
                        "fútbol 5": "/futsal-court.png",
                        fútbol: "/futbol-user.jpg",
                        baloncesto: "/fallback-ball.svg",
                        voleibol: "/fallback-ball.svg",
                        default: "/fallback-ball.svg",
                      };
                      const deporte = (reserva.pista?.deporte || "").toLowerCase();
                      const imagen = reserva.pista?.imagen;
                      
                      const isPlaceholderImage = (url) =>
                        typeof url === "string" &&
                        (url.includes("via.placeholder.com") || url.includes("placeholder.com") || url.includes("picsum.photos"));
                    
                      const isRemoteImage = (url) =>
                        typeof url === "string" && /^https?:\/\//.test(url);

                      if (imagen && !isPlaceholderImage(imagen)) {
                        return imagen;
                      }
                      return defaultImages[deporte] || defaultImages.default;
                    })()}
                    alt={reserva.pista?.nombre || "Pista"} 
                    style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover', flexShrink: 0 }}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/fallback-ball.svg";
                    }}
                  />
                  <div className="reserva-info">
                    <h3>{reserva.pista?.nombre || "Pista"}</h3>
                    <p className="reserva-id">Reserva #{reserva._id.slice(-6)}</p>
                  </div>
                </div>

                <div className="reserva-time">
                  <p className="reserva-date">{formatDate(reserva.fecha)}</p>
                  <p className="reserva-hours">
                    {reserva.hora} ({reserva.duracion || 1.5}h)
                  </p>
                </div>

                <div className="reserva-status">
                  <p className="reserva-price">{reserva.total}€</p>
                  <span
                    className={`status-badge ${
                      reserva.estado === "confirmada" ? "confirmed" : "pending"
                    }`}
                  >
                    {reserva.estado}
                  </span>
                </div>

                <div className="reserva-actions">
                  <Link
                    to={`/pistas/${reserva.pista?._id}`}
                    className="btn-details"
                  >
                    Ver pista
                  </Link>
                  {reserva.estado === "pendiente" && (
                    <button
                      onClick={() => handleConfirmReserva(reserva._id)}
                      className="btn-confirm"
                    >
                      Confirmar
                    </button>
                  )}
                  <button
                    onClick={() => handleCancelReserva(reserva._id)}
                    className="btn-cancel"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
