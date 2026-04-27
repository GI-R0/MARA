import { Link } from "react-router-dom";
import { Zap, MapPin, ShieldCheck, Clock } from "lucide-react";
import "../styles/Home.css";

export default function Home() {
  const features = [
    {
      icon: <Zap className="feature-icon" />,
      title: "Reserva instantánea",
      desc: "Selecciona fecha, hora y pista al instante",
    },
    {
      icon: <MapPin className="feature-icon" />,
      title: "Pistas cerca de ti",
      desc: "Encuentra las mejores instalaciones en tu ciudad",
    },
    {
      icon: <ShieldCheck className="feature-icon" />,
      title: "100% Seguro",
      desc: "Pagos protegidos con encriptación SSL",
    },
    {
      icon: <Clock className="feature-icon" />,
      title: "Disponible 24/7",
      desc: "Reserva cualquier día, a cualquier hora",
    },
  ];

  return (
    <>
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">SportifyClub</h1>
          <p className="hero-subtitle">Reserva pistas deportivas en minutos</p>

          <div className="stats-container">
            <div className="stat-item">
              <div className="stat-number">+120</div>
              <div className="stat-label">Pistas disponibles</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Abierto siempre</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">4.9 ★</div>
              <div className="stat-label">Valoración usuarios</div>
            </div>
          </div>

          <Link to="/pistas" className="btn-hero">
            Ver todas las pistas
          </Link>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <div className="features-header">
            <h2 className="features-title">¿Por qué elegir SportifyClub?</h2>
            <p className="features-subtitle">
              La plataforma más completa para reservar pistas de pádel, tenis,
              fútbol y más
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, idx) => (
              <div key={idx} className="feature-card">
                <div className="feature-icon-wrapper">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2 className="cta-title">¿Listo para jugar?</h2>
          <p className="cta-text">
            Encuentra tu pista perfecta en menos de 1 minuto
          </p>
          <Link to="/pistas" className="btn-cta">
            Reservar ahora
          </Link>
        </div>
      </section>
    </>
  );
}
