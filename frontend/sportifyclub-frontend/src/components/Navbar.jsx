import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          🎾 SportifyClub
        </Link>

        <div className="navbar-nav">
          <Link to="/" className="navbar-link">
            Inicio
          </Link>
          <Link to="/pistas" className="navbar-link">
            Pistas
          </Link>

          {user ? (
            <>
              <Link to="/perfil" className="navbar-link">
                👤 {user.name || user.email}
              </Link>
              {user.role === "admin" && (
                <Link to="/admin" className="navbar-link">
                  ⚙️ Admin
                </Link>
              )}
              <button onClick={logout} className="btn btn-secondary">
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary">
                Iniciar Sesión
              </Link>
              <Link to="/register" className="btn btn-primary">
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
