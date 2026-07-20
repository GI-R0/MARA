import { useAuth } from "../hooks/useAuth";
import { useReservas } from "../context/ReservaContext";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ConfirmModal from "../components/ConfirmModal";
import { getImageUrl, getSportFallbackImage } from "../utils/getImageUrl";
import "../styles/MisReservas.css";

export default function MisReservas() {
  const { user } = useAuth();

  const {
    reservas,
    loading,
    error,
    fetchReservas,
    updateReserva,
    filterByStatus,
    sortReservas,
    resetFilters,
    filters,
  } = useReservas();

  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");
  const [confirmCancelReservaId, setConfirmCancelReservaId] = useState(null);

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
    setConfirmCancelReservaId(id);
  };

  const confirmCancelReserva = async () => {
    if (!confirmCancelReservaId) return;

    // Se unifica el estado a "cancelada"
    const result = await updateReserva(confirmCancelReservaId, { estado: "cancelada" });
    if (result.success) {
      toast.success("Reserva cancelada correctamente.");
      await fetchReservas(); // ¡CRUCIAL! Volver a pedir las reservas para refrescar la vista
      filterByStatus(selectedFilter); // Mantiene el filtro activo actualizado
    } else {
      toast.error(result.error || "Error al cancelar la reserva");
    }

    setConfirmCancelReservaId(null);
  };

  const handleConfirmReserva = async (id) => {
    const result = await updateReserva(id, { estado: "confirmada" });
    if (result.success) {
      toast.success("Reserva confirmada correctamente.");
      await fetchReservas(); // Sincroniza el estado local
      filterByStatus(selectedFilter);
    } else {
      toast.error(result.error || "Error al confirmar la reserva");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Fecha no disponible";

    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "Fecha no disponible";

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

        {reservas.length > 0 || selectedFilter !== "all" ? (
          <div className="reservas-controls">
            <div className="filter-buttons">
              <button
                className={`filter-btn ${selectedFilter === "all" ? "active" : ""}`}
                onClick={() => handleFilterChange("all")}
              >
                Todas
              </button>
              <button
                className={`filter-btn ${selectedFilter === "confirmada" ? "active" : ""}`}
                onClick={() => handleFilterChange("confirmada")}
              >
                Confirmadas
              </button>
              <button
                className={`filter-btn ${selectedFilter === "cancelada" ? "active" : ""}`}
                onClick={() => handleFilterChange("cancelada")}
              >
                Canceladas
              </button>
            </div>

            <div className="sort-controls">
              <button onClick={handleSortChange} className="sort-btn">
                Ordenar por fecha {sortOrder === "asc" ? "↑" : "↓"}
              </button>
              {selectedFilter !== "all" && (
                <button onClick={() => handleFilterChange("all")} className="reset-btn">
                  Limpiar filtros
                </button>
              )}
            </div>
          </div>
        ) : null}

        {reservas.length === 0 ? (
          <div className="reservas-empty">
            <p className="empty-icon">🎾</p>
            <h3 className="empty-title">
              {selectedFilter !== "all"
                ? `No tienes reservas ${selectedFilter}as`
                : "Aún no tienes reservas"}
            </h3>
            <p className="empty-desc">
              {selectedFilter !== "all" ? (
                <button onClick={() => handleFilterChange("all")} className="btn-search">
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
              <div key={reserva._id || `${reserva.fecha}-${reserva.hora}`} className="reserva-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img 
                    src={getImageUrl(reserva.pista)}
                    alt={reserva.pista?.nombre || "Pista"} 
                    style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover', flexShrink: 0 }}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = getSportFallbackImage(reserva.pista);
                    }}
                  />
                  <div className="reserva-info">
                    <h3>{reserva.pista?.nombre || "Pista"}</h3>
                    <p className="reserva-id">Reserva #{String(reserva._id || "").slice(-6)}</p>
                  </div>
                </div>

                <div className="reserva-time">
                  <p className="reserva-date">{formatDate(reserva.fecha)}</p>
                  <p className="reserva-hours">
                    {reserva.hora || "--:--"} ({reserva.duracion || 1.5}h)
                  </p>
                </div>

                <div className="reserva-status">
                  <p className="reserva-price">{Number(reserva.total || 0).toFixed(2)}€</p>
                  <span
                    className={`status-badge ${
                      reserva.estado?.toLowerCase() === "confirmada" 
                        ? "confirmed" 
                        : reserva.estado?.toLowerCase() === "cancelada" 
                        ? "cancelled" 
                        : "pending"
                    }`}
                  >
                    {reserva.estado}
                  </span>
                </div>

                <div className="reserva-actions">
                  <Link
                    to={reserva.pista?._id ? `/pistas/${reserva.pista._id}` : "/pistas"}
                    className="btn-details"
                  >
                    Ver pista
                  </Link>
                  {reserva.estado?.toLowerCase() === "pendiente" && (
                    <button
                      onClick={() => handleConfirmReserva(reserva._id)}
                      className="btn-confirm"
                    >
                      Confirmar
                    </button>
                  )}
                  {/* Solo muestra el botón Cancelar si NO está cancelada ya */}
                  {reserva.estado?.toLowerCase() !== "cancelada" && (
                    <button
                      onClick={() => handleCancelReserva(reserva._id)}
                      className="btn-cancel"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <ConfirmModal
        isOpen={!!confirmCancelReservaId}
        title="Cancelar reserva"
        message="¿Estás seguro de que quieres cancelar esta reserva?"
        onConfirm={confirmCancelReserva}
        onCancel={() => setConfirmCancelReservaId(null)}
      />
    </div>
  );
}
