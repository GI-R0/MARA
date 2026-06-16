import { Link } from "react-router-dom";
import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-overlay"></div>
      <div className="footer-content">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-section">
              <h3 className="footer-title">SportifyClub</h3>
              <p className="footer-text">
                La plataforma líder para reservar pistas deportivas. Fútbol,
                pádel, tenis y más.
              </p>
            </div>

            <div className="footer-section">
              <h4 className="footer-heading">Enlaces Rápidos</h4>
              <ul className="footer-links">
                <li>
                  <Link to="/">Inicio</Link>
                </li>
                <li>
                  <Link to="/pistas">Pistas</Link>
                </li>
                <li>
                  <Link to="/login">Iniciar Sesión</Link>
                </li>
                <li>
                  <Link to="/register">Registrarse</Link>
                </li>
              </ul>
            </div>

            <div className="footer-section">
              <h4 className="footer-heading">Deportes</h4>
              <ul className="footer-links">
                <li>Fútbol</li>
                <li>Pádel</li>
                <li>Tenis</li>
                <li>Baloncesto</li>
              </ul>
            </div>

            <div className="footer-section">
              <h4 className="footer-heading">Contacto</h4>
              <ul className="footer-links">
                <li>info@sportifyclub.com</li>
                <li>+34 900 123 456</li>
                <li>Murcia, España</li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>
              &copy; {new Date().getFullYear()} SportifyClub. Todos los derechos
              reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
