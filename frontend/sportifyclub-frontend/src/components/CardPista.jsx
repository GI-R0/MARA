import { Link } from "react-router-dom";
import { Trophy, Lightbulb, Sun, Layers, MapPin } from "lucide-react";

export default function CardPista({ pista, loading = false }) {
  if (loading) {
    return (
      <div className="card card-skeleton">
        <div className="card-image-container">
          <div className="skeleton-image"></div>
        </div>
        <div className="card-content">
          <h3 className="skeleton-line title-line" />
          <div className="card-info">
            <div className="skeleton-line short" />
            <div className="skeleton-line mid" />
            <div className="skeleton-line long" />
          </div>
          <div className="card-price">
            <div className="skeleton-line price-amount" />
            <div className="skeleton-line price-period" />
          </div>
          <div className="skeleton-button" />
        </div>
      </div>
    );
  }
  const defaultImages = {
    pádel: "/fallback-ball.svg",
    tenis: "/fallback-ball.svg",
    "fútbol 5": "/futsal-court.png",
    fútbol: "/futbol-user.jpg",
    baloncesto: "/fallback-ball.svg",
    voleibol: "/fallback-ball.svg",
    default: "/fallback-ball.svg",
  };

  const isPlaceholderImage = (url) =>
    typeof url === "string" &&
    (url.includes("via.placeholder.com") || url.includes("placeholder.com") || url.includes("picsum.photos"));

  const isRemoteImage = (url) =>
    typeof url === "string" && /^https?:\/\//.test(url);

  const fallbackPath = "/fallback-ball.svg";

  const getImageUrl = () => {
    const deporte = (pista.deporte || "").toLowerCase();

    if (pista.imagen && !isPlaceholderImage(pista.imagen)) {
      return pista.imagen;
    }

    return defaultImages[deporte] || defaultImages.default;
  };

  const isAvailable =
    Array.isArray(pista.horariosDisponibles) &&
    pista.horariosDisponibles.length > 0;

  return (
    <Link to={`/pistas/${pista._id}`} className="card">
      <div className="card-image-container">
        <img
          src={getImageUrl()}
          alt={pista.nombre}
          className="card-image"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = fallbackPath;
          }}
        />
        <div className="card-overlay"></div>

        <div className="card-badge-top-right">
          <span
            className={`badge ${
              isAvailable ? "badge-success" : "badge-danger"
            }`}
          >
            {isAvailable ? "✓ Disponible" : "✗ Ocupada"}
          </span>
        </div>

        <div className="card-badge-top-left">
          <span className="badge-icon">
            <Trophy size={16} />
          </span>
          {" "}
          {pista.deporte || "Pádel"}
        </div>
      </div>

      <div className="card-content">
        <h3 className="card-title">{pista.nombre}</h3>

        <div className="card-info">
          <div className="card-info-item">
            <span className="feature">
              <span className="feature-icon">
                {pista.iluminacion ? <Lightbulb size={14} /> : <Sun size={14} />}
              </span>
              {pista.iluminacion ? "Iluminación LED" : "Luz natural"}
            </span>
          </div>
          <div className="card-info-item">
            <span className="feature">
              <span className="feature-icon">
                <Layers size={14} />
              </span>
              {pista.superficie || "Césped artificial"}
            </span>
          </div>
          {pista.ubicacion && (
            <div className="card-info-item">
              <span className="feature">
                <span className="feature-icon">
                  <MapPin size={14} />
                </span>
                {pista.ubicacion}
              </span>
            </div>
          )}
        </div>

        <div className="card-price">
          <span className="price-amount">{pista.precioHora}</span>
          <span className="price-period">€/hora</span>
        </div>

        <button className="card-button">Reservar →</button>
      </div>
    </Link>
  );
}
