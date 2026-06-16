import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axiosConfig";
import "../styles/Auth.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const { data } = await API.post("/auth/forgot-password", {
        email: email.toLowerCase().trim(),
      });
      setMessage(data.msg || "Revisa tu correo para más instrucciones.");
      setEmail("");
    } catch (err) {
      setError(
        err.response?.data?.msg || err.response?.data?.errors?.[0]?.msg ||
          "No se pudo enviar la solicitud",
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
            <h1 className="login-title">Recuperar contraseña</h1>
            <p className="login-subtitle">Te enviaremos un enlace a tu correo</p>
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

              <button
                type="submit"
                disabled={loading || !email}
                className="btn-submit"
              >
                {loading ? "Enviando..." : "Enviar enlace de recuperación"}
              </button>
            </form>

            <div className="login-footer">
              <p className="footer-text">
                ¿Volver al inicio de sesión?{" "}
                <Link to="/login" className="footer-link">
                  Iniciar sesión
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
