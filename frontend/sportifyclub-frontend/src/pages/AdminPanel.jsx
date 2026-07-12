import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

export default function AdminPanel() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const adminMenus = [
    {
      title: "Usuarios",
      description: "Ver, editar y gestionar cuentas",
      icon: "Personas",
      path: "/admin/users",
    },
    {
      title: "Pistas",
      description: "Crear, modificar y eliminar pistas",
      icon: "Tenis",
      path: "/admin/pistas",
    },
    {
      title: "Reservas",
      description: "Control total de reservas activas",
      icon: "Calendario",
      path: "/admin/reservas",
    },
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Panel de Administración</h1>
          <p className="dashboard-subtitle">
            Bienvenido,{" "}
            <span className="footer-link">
              {user?.name || user?.nombre || user?.email || "Admin"}
            </span>
            . Tienes control total del sistema.
          </p>
        </div>

        <div className="actions-grid">
          {adminMenus.map((menu) => (
            <Link key={menu.path} to={menu.path} className="action-card white">
              <div className="action-icon">
                {menu.icon === "Personas" && "👥"}
                {menu.icon === "Tenis" && "🎾"}
                {menu.icon === "Calendario" && "📅"}
              </div>
              <h3 className="action-title">{menu.title}</h3>
              <p className="action-desc">{menu.description}</p>
              <span className="action-link-text">Ir al módulo →</span>
            </Link>
          ))}
        </div>

        <div className="footer-buttons">
          <Link to="/perfil" className="btn-volver" >
            Volver al perfil
          </Link>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="btn-danger"
          >
            Cerrar sesión
          </button>
        </div>

        <div className="stats-grid" style={{ marginTop: "3rem" }}>
          <div className="stat-card">
            <p className="stat-value text-blue">127</p>
            <p className="stat-label">Usuarios</p>
          </div>
          <div className="stat-card">
            <p className="stat-value text-green">89</p>
            <p className="stat-label">Pistas</p>
          </div>
          <div className="stat-card">
            <p className="stat-value text-blue">342</p>
            <p className="stat-label">Reservas hoy</p>
          </div>
          <div className="stat-card">
            <p className="stat-value text-purple">€8.421</p>
            <p className="stat-label">Ingresos mes</p>
          </div>
        </div>
      </div>
    </div>
  );
}
