import { Link } from "react-router-dom";

export default function CardPista({ pista }) {
  const defaultImages = {
    pádel:
      "https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=800&q=80",
    tenis:
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80",
    "fútbol 5":
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80",
    fútbol:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80",
    baloncesto:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80",
    voleibol:
      "https://images.unsplash.com/photo-1592656094267-764a45160876?w=800&q=80",
    default:
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80",
  };

  const getImageUrl = () => {
    if (pista.imagen) return pista.imagen;
    const deporte = (pista.deporte || "").toLowerCase();
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
