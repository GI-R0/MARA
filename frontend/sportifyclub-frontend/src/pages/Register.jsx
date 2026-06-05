import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axiosConfig";
import { Eye, EyeOff } from "lucide-react";
import "../styles/Auth.css";

export default function Register() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmarPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    if (!formData.nombre || !formData.email || !formData.password) {
      setError("Completa todos los campos");
      return;
    }

    if (formData.password !== formData.confirmarPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (formData.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    const hasUpper = /[A-Z]/.test(formData.password);
    const hasLower = /[a-z]/.test(formData.password);
    const hasNumber = /[0-9]/.test(formData.password);
    const hasSpecial = /[@$!%*?&]/.test(formData.password);

    if (!hasUpper || !hasLower || !hasNumber || !hasSpecial) {
      setError(
        "La contraseña debe incluir mayúscula, minúscula, número y carácter especial",
      );
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
      const responseData = err.response?.data;
      let mensaje = "Error al crear la cuenta";
      if (responseData?.errors && Array.isArray(responseData.errors)) {
        mensaje = responseData.errors
          .map((error) => error.msg || error.message || error)
          .join(". ");
      } else if (responseData?.msg) {
        mensaje = responseData.msg;
      }
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
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Mínimo 8 caracteres"
                    required
                    minLength="8"
                    disabled={loading}
                    style={{ paddingRight: "40px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: "var(--gray-600)",
                      cursor: "pointer",
                      padding: "4px"
                    }}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirmar contraseña</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmarPassword"
                    value={formData.confirmarPassword}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Repite tu contraseña"
                    required
                    disabled={loading}
                    style={{ paddingRight: "40px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: "var(--gray-600)",
                      cursor: "pointer",
                      padding: "4px"
                    }}
                    aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
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
