import { Link } from "react-router-dom";
import { MapPin, DollarSign, Zap } from "lucide-react";
import { getImageUrl } from "../utils/getImageUrl";
import "../styles/Pistas.css";

export default function CardPista({ pista, loading }) {
  if (loading) {
    return (
      <div className="card-pista skeleton">
        <div className="card-image skeleton-image" />
        <div className="card-body">
          <div className="skeleton-text" style={{ width: "80%", height: "1rem" }} />
          <div className="skeleton-text" style={{ width: "60%", height: "0.875rem" }} />
          <div className="skeleton-text" style={{ width: "40%", height: "0.875rem" }} />
        </div>
      </div>
    );
  }

  if (!pista) return null;

  return (
    <Link to={`/pistas/${pista._id}`} className="card-pista">
      <div className="card-image-container">
        <img
          src={getImageUrl(pista)}
          alt={pista.nombre}
          className="card-image"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/fallback-ball.svg";
          }}
        />
        <div className="card-overlay">
          <button className="btn-reservar-card">Reservar</button>
        </div>
      </div>

      <div className="card-body">
        <h3 className="card-title">{pista.nombre}</h3>

        <div className="card-deporte">
          {pista.deporte && <span className="deporte-badge">{pista.deporte}</span>}
        </div>

        <div className="card-info">
          {pista.ubicacion && (
            <div className="info-item">
              <MapPin size={14} className="info-icon" />
              <span className="info-text">{pista.ubicacion}</span>
            </div>
          )}
          {pista.precioHora && (
            <div className="info-item">
              <DollarSign size={14} className="info-icon" />
              <span className="info-text">{pista.precioHora}€/h</span>
            </div>
          )}
          {pista.iluminacion && (
            <div className="info-item">
              <Zap size={14} className="info-icon" style={{ color: "#f59e0b" }} />
              <span className="info-text">Iluminada</span>
            </div>
          )}
        </div>

        <div className="card-footer">
          <span className="card-rating">⭐ 4.5 (23)</span>
        </div>
      </div>
    </Link>
  );
}
