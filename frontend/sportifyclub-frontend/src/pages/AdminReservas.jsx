import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axiosConfig";
import "../styles/Dashboard.css";

export default function AdminReservas() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savingReservaId, setSavingReservaId] = useState(null);
  const [deletingReservaId, setDeletingReservaId] = useState(null);

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const res = await API.get("/reservas");
        setReservas(res.data.reservas || []);
      } catch (err) {
        console.error("Error fetching admin reservas:", err);
        setError("No se pudieron cargar las reservas.");
      } finally {
        setLoading(false);
      }
    };

    fetchReservas();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleUpdateReservaEstado = async (reservaId, estado) => {
    setSavingReservaId(reservaId);
    try {
      const res = await API.put(`/reservas/${reservaId}`, { estado });
      setReservas((prev) =>
        prev.map((reserva) =>
          reserva._id === reservaId ? res.data : reserva,
        ),
      );
    } catch (err) {
      console.error("Error updating reserva estado:", err);
      setError("No se pudo actualizar el estado de la reserva.");
    } finally {
      setSavingReservaId(null);
    }
  };

  const handleDeleteReserva = async (reservaId) => {
    if (!window.confirm("¿Eliminar esta reserva? Esta acción no se puede deshacer.")) {
      return;
    }

    setDeletingReservaId(reservaId);
    try {
      await API.delete(`/reservas/${reservaId}`);
      setReservas((prev) => prev.filter((reserva) => reserva._id !== reservaId));
    } catch (err) {
      console.error("Error deleting reserva:", err);
      setError("No se pudo eliminar la reserva.");
    } finally {
      setDeletingReservaId(null);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Reservas</h1>
            <p className="dashboard-subtitle">
              Todas las reservas registradas en el sistema
            </p>
          </div>
          <Link to="/admin" className="btn-secondary">
            Volver al panel
          </Link>
        </div>

        {loading ? (
          <div className="loading-screen">
            <p>Cargando reservas...</p>
          </div>
        ) : error ? (
          <div className="error-alert">{error}</div>
        ) : (
          <div className="table-container">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>ID reserva</th>
                  <th>Usuario</th>
                  <th>Pista</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Duración</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reservas.length === 0 ? (
                  <tr>
                    <td colSpan="9">No hay reservas registradas.</td>
                  </tr>
                ) : (
                  reservas.map((reserva) => (
                    <tr key={reserva._id}>
                      <td>{reserva._id.slice(-6)}</td>
                      <td>{reserva.usuario?.name || reserva.usuario?.email}</td>
                      <td>{reserva.pista?.nombre || "-"}</td>
                      <td>{formatDate(reserva.fecha)}</td>
                      <td>{reserva.hora}</td>
                      <td>{reserva.duracion}</td>
                      <td>{reserva.total}€</td>
                      <td>{reserva.estado}</td>
                      <td>
                        {reserva.estado !== "confirmada" && (
                          <button
                            className="btn-confirm small"
                            disabled={savingReservaId === reserva._id}
                            onClick={() =>
                              handleUpdateReservaEstado(reserva._id, "confirmada")
                            }
                          >
                            {savingReservaId === reserva._id
                              ? "Guardando..."
                              : "Confirmar"}
                          </button>
                        )}
                        {reserva.estado !== "cancelada" && (
                          <button
                            className="btn-cancel small"
                            disabled={savingReservaId === reserva._id}
                            onClick={() =>
                              handleUpdateReservaEstado(reserva._id, "cancelada")
                            }
                          >
                            {savingReservaId === reserva._id
                              ? "Guardando..."
                              : "Cancelar"}
                          </button>
                        )}
                        <button
                          className="btn-delete small"
                          disabled={deletingReservaId === reserva._id}
                          onClick={() => handleDeleteReserva(reserva._id)}
                        >
                          {deletingReservaId === reserva._id
                            ? "Eliminando..."
                            : "Eliminar"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
