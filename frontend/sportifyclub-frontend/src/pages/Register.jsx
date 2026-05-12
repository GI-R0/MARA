import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axiosConfig";
import "../styles/Auth.css";

export default function Register() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmarPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmarPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (!formData.nombre || !formData.email) {
      setError("Completa todos los campos");
      return;
    }

    setLoading(true);

    try {
      await API.post("/auth/register", {
        name: formData.nombre.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
      });

      navigate("/login", {
        state: {
          message: "¡Cuenta creada con éxito! Ya puedes iniciar sesión.",
        },
      });
    } catch (err) {
      const mensaje = err.response?.data?.msg || "Error al crear la cuenta";
      setError(mensaje);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="w-full max-w-md">
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">SportifyClub</h1>
            <p className="login-subtitle">Únete a la comunidad</p>
          </div>

          <div className="login-body">
            <h2 className="login-heading">Crear Cuenta</h2>

            {error && (
              <div className="login-error">
                <span className="error-text">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label className="form-label">Nombre completo</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Juan Pérez"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="tucorreo@ejemplo.com"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength="6"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirmar contraseña</label>
                <input
                  type="password"
                  name="confirmarPassword"
                  value={formData.confirmarPassword}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Repite tu contraseña"
                  required
                  disabled={loading}
                />
              </div>

              <button type="submit" disabled={loading} className="btn-submit">
                {loading ? (
                  <span className="loading-content">
                    <svg className="spinner" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Creando cuenta...
                  </span>
                ) : (
                  "Crear mi cuenta gratis"
                )}
              </button>
            </form>

            <div className="login-footer">
              <p className="footer-text">
                ¿Ya tienes cuenta?{" "}
                <Link to="/login" className="footer-link">
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </div>
        </div>

        <p className="copyright">
          © {new Date().getFullYear()} SportifyClub • Reserva tu pista en
          segundos
        </p>
      </div>
    </div>
  );
}
