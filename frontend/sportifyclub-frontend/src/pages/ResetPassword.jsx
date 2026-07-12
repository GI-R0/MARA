import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import API from "../api/axiosConfig";
import { PASSWORD_MESSAGE, PASSWORD_REGEX } from "../utils/passwordPolicy";
import "../styles/Auth.css";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tokenParam = searchParams.get("token") || "";
    setToken(tokenParam);
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!token) {
      setError("El token de recuperación no se encontró en la URL.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (!PASSWORD_REGEX.test(password)) {
      setError(PASSWORD_MESSAGE);
      return;
    }

    setLoading(true);

    try {
      await API.post("/auth/reset-password", { token, password });
      setMessage("Contraseña restablecida correctamente. Ya puedes iniciar sesión.");
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(
        err.response?.data?.msg || err.response?.data?.errors?.[0]?.msg ||
          "No se pudo restablecer la contraseña",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="w-full max-w-md">
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">Restablecer contraseña</h1>
            <p className="login-subtitle">Ingresa una nueva contraseña segura</p>
          </div>

          <div className="login-body">
            {message && (
              <div className="login-success">
                <span>{message}</span>
              </div>
            )}
            {error && (
              <div className="login-error">
                <span className="error-title">Error</span>
                <span className="error-text">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Nueva contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  autoComplete="new-password"
                />
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

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirmar contraseña
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-input"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  autoComplete="new-password"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !password || !confirmPassword}
                className="btn-submit"
              >
                {loading ? "Restableciendo..." : "Cambiar contraseña"}
              </button>
            </form>

            <div className="login-footer">
              <p className="footer-text">
                ¿Ya recuerdas tu contraseña?{" "}
                <Link to="/login" className="footer-link">
                  Volver a iniciar sesión
                </Link>
              </p>
            </div>
          </div>
        </div>

        <p className="copyright">
          © {new Date().getFullYear()} SportifyClub • Todos los derechos reservados
        </p>
      </div>
    </div>
  );
}
