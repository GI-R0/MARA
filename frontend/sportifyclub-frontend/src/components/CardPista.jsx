import { Link } from "react-router-dom";

export default function CardPista({ pista }) {
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

        <div className="card-badge-top-left">🎾 {pista.deporte || "Pádel"}</div>
      </div>

      <div className="card-content">
        <h3 className="card-title">{pista.nombre}</h3>

        <div className="card-info">
          <div className="card-info-item">
            <span>
              {pista.iluminacion ? "💡 Iluminación LED" : "☀️ Luz natural"}
            </span>
          </div>
          <div className="card-info-item">
            <span>🏗️ {pista.superficie || "Césped artificial"}</span>
          </div>
          {pista.ubicacion && (
            <div className="card-info-item">
              <span>📍 {pista.ubicacion}</span>
            </div>
          )}
        </div>

        <div className="card-price">
          <span className="price-amount">{pista.precioHora}</span>
          <span className="text-gray-600">€/hora</span>
        </div>

        <button className="btn-full">Reservar →</button>
      </div>
    </Link>
  );
}
