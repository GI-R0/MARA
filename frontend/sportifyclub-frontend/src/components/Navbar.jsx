import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Menu, X, Trophy, User } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <span style={{display: 'inline-flex', alignItems: 'center', gap: 8}}>
            <Trophy size={20} />
            SportifyClub
          </span>
        </Link>

        <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Toggle menu">
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <div className={`navbar-nav ${isMenuOpen ? "active" : ""}`}>
          <Link to="/" className="navbar-link" onClick={closeMenu}>
            Inicio
          </Link>
          <Link to="/pistas" className="navbar-link" onClick={closeMenu}>
            Pistas
          </Link>

          {user ? (
            <>
              <Link to="/perfil" className="navbar-link" onClick={closeMenu}>
                <User size={16} style={{marginRight:8}} /> {user.name || user.email}
              </Link>
              {user.role === "club" && (
                <Link to="/club" className="navbar-link" onClick={closeMenu}>
                  <Trophy size={16} style={{marginRight:8}} /> Mi Club
                </Link>
              )}
              {user.role === "admin" && (
                <Link to="/admin" className="navbar-link" onClick={closeMenu}>
                  ⚙️ Admin
                </Link>
              )}
              <button 
                onClick={() => {
                  logout();
                  closeMenu();
                }} 
                className="btn btn-secondary"
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary" onClick={closeMenu}>
                Iniciar Sesión
              </Link>
              <Link to="/register" className="btn btn-primary" onClick={closeMenu}>
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
