import React from "react";
import { Link } from "react-router-dom";
import "../styles/ReservaErrorBoundary.css";

export default class ReservaErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[ReservaErrorBoundary] Render error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="reserva-error-boundary">
          <div className="reserva-error-card">
            <h2>Se produjo un error al renderizar reservas</h2>
            <p>
              Intenta recargar esta sección. Si el problema persiste, vuelve al
              listado de pistas.
            </p>
            <div className="reserva-error-actions">
              <button onClick={this.handleRetry} className="btn-retry-render">
                Reintentar
              </button>
              <Link to="/pistas" className="btn-go-pistas">
                Ir a pistas
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
