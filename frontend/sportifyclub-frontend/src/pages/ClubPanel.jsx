import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../api/axiosConfig";
import "../styles/Dashboard.css";

export default function ClubPanel() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarEstadisticas = async () => {
      try {
        const res = await API.get("/pistas/estadisticas");
        setStats([
          {
            label: "Pistas activas",
            value: res.data.pistasActivas,
            color: "text-blue",
          },
          {
            label: "Reservas hoy",
            value: res.data.reservasHoy,
            color: "text-green",
          },
          {
            label: "Ingresos mes",
            value: `€${res.data.ingresosMes}`,
            color: "text-purple",
          },
          {
            label: "Valoración",
            value: res.data.valoracion,
            color: "text-yellow",
          },
        ]);
        setError("");
      } catch {
        setError("No se pudieron cargar las estadísticas");
        setStats([
          { label: "Pistas activas", value: "0", color: "text-blue" },
          { label: "Reservas hoy", value: "0", color: "text-green" },
          { label: "Ingresos mes", value: "€0", color: "text-purple" },
          { label: "Valoración", value: "0.0", color: "text-yellow" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    cargarEstadisticas();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-spinner-lg"></div>
          <p className="loading-text">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Panel del Club</h1>
          <p className="dashboard-subtitle">
            ¡Hola, {user?.name || user?.email}! Gestiona tu club como un pro
          </p>
          {error && <p className="dashboard-error">{error}</p>}
        </div>

        <div className="stats-grid">
          {stats &&
            stats.map((stat, i) => (
              <div key={i} className="stat-card">
                <p className="stat-value">{stat.value}</p>
                <p className={`stat-label ${stat.color}`}>{stat.label}</p>
              </div>
            ))}
        </div>

        <div className="actions-grid">
          <Link to="/club/pistas" className="action-card">
            <span className="action-icon">🎾</span>
            <h3 className="action-title">Gestionar Pistas</h3>
            <p className="action-desc">Añadir, editar o eliminar pistas</p>
          </Link>

          <Link to="/mis-reservas" className="action-card green">
            <span className="action-icon">📅</span>
            <h3 className="action-title">Ver Reservas</h3>
            <p className="action-desc">Control total de horarios</p>
          </Link>

          <Link to="/perfil" className="action-card purple">
            <span className="action-icon">📊</span>
            <h3 className="action-title">Estadísticas</h3>
            <p className="action-desc">Ingresos y ocupación</p>
          </Link>
        </div>

        <div className="dashboard-footer">
          <p className="footer-text">
            ¿Necesitas ayuda? Contacta con soporte en{" "}
            <span className="footer-link">soporte@sportifyclub.com</span>
          </p>
        </div>
      </div>
    </div>
  );
}
