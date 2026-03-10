import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "../styles/Perfil.css";

export default function Perfil() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="access-denied-container">
        <div className="access-denied-card">
          <div className="access-icon">🔒</div>
          <h3 className="access-title">Acceso requerido</h3>
          <p className="access-desc">
            Debes iniciar sesión para ver tu perfil.
          </p>
          <Link to="/login" className="btn-login">
            Ir al Login
          </Link>
        </div>
      </div>
    );
  }

  const roleConfig = {
    admin: { label: "Administrador", className: "admin", icon: "👑" },
    club: { label: "Club", className: "club", icon: "🏢" },
    user: { label: "Usuario", className: "user", icon: "👤" },
  };

  const config = roleConfig[user.role] || roleConfig.user;
  const { label, className, icon } = config;

  return (
    <div className="perfil-page">
      <div className="perfil-container">
        <div className="perfil-card">
          
          <div className="perfil-header">
            <div className="perfil-icon">{icon}</div>
            <h1 className="perfil-title">Mi Perfil</h1>
            <p className="perfil-subtitle">
              ¡Hola de nuevo, {user.name || user.nombre || user.email}!
            </p>
          </div>

          <div className="perfil-content">
            
            <div className="perfil-grid">
              <div>
                <p className="info-label">Nombre completo</p>
                <p className="info-value">
                  {user.name || user.nombre || "No especificado"}
                </p>
              </div>

              <div>
                <p className="info-label">Email</p>
                <p className="info-value-email">{user.email}</p>
              </div>

              <div>
                <p className="info-label">Rol en la plataforma</p>
                <span className={`role-badge ${className}`}>
                  {icon} {label}
                </span>
              </div>

              <div>
                <p className="info-label">ID de usuario</p>
                <p className="id-box">{user._id || user.id}</p>
              </div>
            </div>

            
            <div className="perfil-actions">
              <div className="actions-grid">
                {user.role === "admin" && (
                  <Link to="/admin" className="btn-action btn-admin">
                    Panel de Administración
                  </Link>
                )}

                {user.role === "club" && (
                  <Link to="/club" className="btn-action btn-club">
                    Gestión de mi Club
                  </Link>
                )}

                <Link to="/mis-reservas" className="btn-action btn-reservas">
                  Mis Reservas
                </Link>

                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="btn-action btn-logout"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="perfil-footer">
          SportifyClub © {new Date().getFullYear()} • Tu plataforma de reservas deportivas
        </p>
      </div>
    </div>
  );
}
