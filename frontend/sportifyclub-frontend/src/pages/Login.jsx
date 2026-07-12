import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Eye, EyeOff } from "lucide-react";
import { PASSWORD_MESSAGE } from "../utils/passwordPolicy";
import "../styles/Auth.css";

const ACTIVE_SESSION_MESSAGE =
  "Ya hay una sesion activa. Cierra sesion antes de iniciar o crear otra cuenta.";

const getDashboardPath = (currentUser) => {
  if (currentUser?.role === "admin") return "/admin";
  if (currentUser?.role === "club") return "/club";
  return "/perfil";
};

export default function Login() {
  const { login, user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  if (authLoading) return null;

  if (user) {
    return (
      <div className="login-container">
        <div className="w-full max-w-md">
          <div className="login-card">
            <div className="login-header">
              <h1 className="login-title">SportifyClub</h1>
              <p className="login-subtitle">Inicio de sesión bloqueado</p>
            </div>
            <div className="login-body">
              <div className="login-error">
                <span className="error-text">{ACTIVE_SESSION_MESSAGE}</span>
              </div>
              <Link to={getDashboardPath(user)} className="btn-submit" style={{ textAlign: "center" }}>
                Ir a mi panel
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setError("");
    setLoading(true);

    try {
      const response = await login(email.toLowerCase().trim(), password);
      navigate(getDashboardPath(response.user), { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.msg || err.message || "Credenciales inválidas";
      setError(msg);
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
            <p className="login-subtitle">Accede a tu cuenta</p>
          </div>

          <div className="login-body">
            <h2 className="login-heading">Iniciar Sesión</h2>

            {error && (
              <div className="login-error">
                <span className="error-title">Error</span>
                <span className="error-text">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  placeholder="tucorreo@ejemplo.com"
                  required
                  disabled={loading}
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Contraseña
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                    placeholder="Tu contraseña"
                    required
                    disabled={loading}
                    autoComplete="current-password"
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
                      color: "var(--barca-light-blue)",
                      cursor: "pointer",
                      padding: "4px",
                      transition: "opacity 0.2s ease",
                    }}
                    aria-label={
                      showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <small
                  style={{
                    color: "var(--gray-600)",
                    fontSize: "0.75rem",
                    marginTop: "4px",
                    display: "block",
                  }}
                >
                  {PASSWORD_MESSAGE}
                </small>
              </div>

              <button
                type="submit"
                disabled={loading || !email || !password}
                className="btn-submit"
              >
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
                    Entrando...
                  </span>
                ) : (
                  "Acceder a mi cuenta"
                )}
              </button>
            </form>

            <div className="login-footer">
              <p className="footer-text">
                <Link to="/forgot-password" className="footer-link">
                  ¿Olvidaste tu contraseña?
                </Link>
              </p>
              <p className="footer-text">
                ¿Primera vez aquí?{" "}
                <Link to="/register" className="footer-link">
                  Crea tu cuenta gratis
                </Link>
              </p>
            </div>
          </div>
        </div>

        <p className="copyright">
          © {new Date().getFullYear()} SportifyClub • Todos los derechos
          reservados
        </p>
      </div>
    </div>
  );
}
