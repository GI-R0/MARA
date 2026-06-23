import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import "../styles/Auth.css";

const PASSWORD_RULES = [
  { id: "length", label: "Mínimo 8 caracteres", test: (p) => p.length >= 8 },
  {
    id: "upper",
    label: "Al menos una mayúscula (A-Z)",
    test: (p) => /[A-Z]/.test(p),
  },
  {
    id: "lower",
    label: "Al menos una minúscula (a-z)",
    test: (p) => /[a-z]/.test(p),
  },
  {
    id: "number",
    label: "Al menos un número (0-9)",
    test: (p) => /[0-9]/.test(p),
  },
  {
    id: "special",
    label: "Un carácter especial (@$!%*?&)",
    test: (p) => /[@$!%*?&]/.test(p),
  },
];

function validatePassword(password) {
  return PASSWORD_RULES.every((rule) => rule.test(password));
}

export default function Register() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmarPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { register: authRegister } = useAuth();

  const validatePassword = (value) => ({
    length: value.length >= 8,
    uppercase: /[A-Z]/.test(value),
    lowercase: /[a-z]/.test(value),
    number: /[0-9]/.test(value),
    special: /[@$!%*?&]/.test(value),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError("");
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "password") {
      setPasswordValidations(validatePassword(value));
    }
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

    const validations = validatePassword(formData.password);
    setPasswordValidations(validations);

    if (Object.values(validations).includes(false)) {
      setError("La contraseña no cumple los requisitos mínimos");
      return;
    }

    if (!formData.nombre || !formData.email) {
      setError("Completa todos los campos");
      return;
    }

    setLoading(true);

    try {
      await authRegister(
        formData.nombre.trim(),
        formData.email.toLowerCase().trim(),
        formData.password,
      );

      navigate("/", {
        state: {
          message: "¡Cuenta creada con éxito! Bienvenido a SportifyClub.",
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
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    className="form-input"
                    placeholder="Mínimo 8 caracteres: mayúscula, minúscula, número y símbolo (@$!%*?&)"
                    required
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
                      padding: "4px",
                    }}
                    aria-label={
                      showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {(passwordFocused || formData.password.length > 0) && (
                  <div className="password-requirements">
                    <p className="requirements-title">
                      Tu contraseña debe tener:
                    </p>
                    <ul className="requirements-list">
                      {PASSWORD_RULES.map((rule) => {
                        const passed = rule.test(formData.password);
                        return (
                          <li
                            key={rule.id}
                            className={`requirement-item ${passed ? "passed" : "pending"}`}
                          >
                            <span className="requirement-icon">
                              {passed ? "✓" : "○"}
                            </span>
                            {rule.label}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
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
                      padding: "4px",
                    }}
                    aria-label={
                      showConfirmPassword
                        ? "Ocultar contraseña"
                        : "Mostrar contraseña"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
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
