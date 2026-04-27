import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import API from "../api/axiosConfig";
import "../styles/Perfil.css";

export default function Perfil() {
  const { user, logout, loadUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name || user.nombre || "" });
    }
  }, [user]);

  if (authLoading) {
    return (
      <div className="perfil-loading">
        <p>Cargando perfil...</p>
      </div>
    );
  }

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    const trimmedName = formData.name.trim();
    if (!trimmedName || trimmedName.length < 2) {
      setError("El nombre debe tener al menos 2 caracteres");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await API.put("/auth/profile", { name: trimmedName });
      setSuccess("Perfil actualizado correctamente");
      await loadUser();
      setEditMode(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.msg || "Error al actualizar perfil");
    } finally {
      setLoading(false);
    }
  };

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

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="perfil-content">
            <div className="perfil-grid">
              <div>
                <p className="info-label">Nombre completo</p>
                {editMode ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="info-input"
                    placeholder="Tu nombre"
                  />
                ) : (
                  <p className="info-value">
                    {user.name || user.nombre || "No especificado"}
                  </p>
                )}
              </div>

              <div>
                <p className="info-label">Email</p>
                <p className="info-value-email">{user.email}</p>
                <small className="text-muted">
                  El email no se puede cambiar
                </small>
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
                {editMode ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="btn-action btn-save"
                    >
                      {loading ? "Guardando..." : "Guardar Cambios"}
                    </button>
                    <button
                      onClick={() => {
                        setEditMode(false);
                        setFormData({ name: user.name });
                        setError("");
                      }}
                      className="btn-action btn-cancel"
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setEditMode(true)}
                      className="btn-action btn-edit"
                    >
                      Editar Perfil
                    </button>

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

                    <Link
                      to="/mis-reservas"
                      className="btn-action btn-reservas"
                    >
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
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <p className="perfil-footer">
          SportifyClub © {new Date().getFullYear()} • Tu plataforma de reservas
          deportivas
        </p>
      </div>
    </div>
  );
}
