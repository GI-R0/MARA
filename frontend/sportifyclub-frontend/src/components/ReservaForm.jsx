import { useState, useEffect } from "react";
import API from "../api/axiosConfig";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "../styles/ReservaForm.css";

export default function ReservaForm({
  pistaId,
  precioHora = 0,
  availableTimes: initialAvailableTimes = [],
}) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [date, setDate] = useState("");
  const [hour, setHour] = useState("");
  const [duracion, setDuracion] = useState(1);
  const [availableTimes, setAvailableTimes] = useState(initialAvailableTimes);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const displayedTimes = (() => {
    if (!date) return availableTimes;

    const selectedDate = new Date(date);
    const now = new Date();
    const isToday =
      selectedDate.getFullYear() === now.getFullYear() &&
      selectedDate.getMonth() === now.getMonth() &&
      selectedDate.getDate() === now.getDate();

    if (!isToday) return availableTimes;

    return availableTimes.filter((h) => {
      const slotTime = new Date(`${date}T${h}:00`);
      return slotTime > now;
    });
  })();

  // Cargar horarios disponibles cuando cambie la fecha
  useEffect(() => {
    if (date && pistaId) {
      const cargarHorarios = async () => {
        try {
          const res = await API.get(`/pistas/${pistaId}?fecha=${date}`);
          setAvailableTimes(res.data.horariosDisponibles || []);
        } catch (err) {
          console.error("Error cargando horarios:", err);
          setAvailableTimes(initialAvailableTimes);
        }
      };
      cargarHorarios();
    } else {
      setAvailableTimes(initialAvailableTimes);
    }
  }, [date, pistaId, initialAvailableTimes]);

  // Resetear hora si no está disponible en los nuevos horarios
  useEffect(() => {
    if (hour && !displayedTimes.includes(hour)) {
      setHour("");
    }
  }, [displayedTimes, hour]);

  const validateHourFormat = (hourString) => {
    return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(hourString);
  };

  const isHourAvailable = (selectedHour) => {
    return availableTimes.includes(selectedHour);
  };

  const isValidDuration = (dur) => {
    const durNum = Number(dur);
    return durNum >= 1 && durNum <= 3;
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user) {
      setError("Tienes que iniciar sesión para reservar");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    if (!date || !hour || !duracion) {
      setError("Por favor completa todos los campos requeridos");
      return;
    }

    const fechaSeleccionada = new Date(date);
    if (isNaN(fechaSeleccionada.getTime())) {
      setError("Fecha inválida. Por favor selecciona una fecha válida");
      return;
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    if (fechaSeleccionada < hoy) {
      setError("No puedes hacer reservas en fechas pasadas");
      return;
    }

    if (!validateHourFormat(hour)) {
      setError("Formato de hora inválido. Usa HH:MM");
      return;
    }

    if (!isHourAvailable(hour)) {
      setError("La hora seleccionada no está disponible");
      return;
    }

    if (!isValidDuration(duracion)) {
      setError("La duración debe ser entre 1 y 3 horas");
      return;
    }

    if (precioHora <= 0) {
      setError("Error: precio de la pista no válido");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post("/reservas", {
        usuario: user._id,
        pista: pistaId,
        fecha: date,
        hora: hour,
        duracion: Number(duracion),
      });

      if (response.status === 201) {
        setSuccess(
          `¡Reserva confirmada para el ${date} a las ${hour} h (${duracion}h)!`,
        );

        setDate("");
        setHour("");
        setDuracion(1);

        setTimeout(() => navigate("/mis-reservas"), 2000);
      }
    } catch (err) {
      const mensaje =
        err.response?.data?.msg ||
        err.response?.data?.message ||
        err.message ||
        "No se pudo completar la reserva. Intenta nuevamente";

      setError(mensaje);
      console.error("Error en reserva:", err);
    } finally {
      setLoading(false);
    }
  };

  const total = precioHora > 0 ? (precioHora * duracion).toFixed(2) : 0;
  const hasAvailableTimes = displayedTimes && displayedTimes.length > 0;

  return (
    <form onSubmit={handleSubmit} className="reserva-form">
      {success && <div className="reserva-success">✓ {success}</div>}

      {error && <div className="reserva-error">✕ {error}</div>}

      <div className="reserva-field">
        <label htmlFor="fecha" className="reserva-label">
          Fecha de la reserva *
        </label>
        <input
          id="fecha"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          min={today}
          required
          disabled={loading}
          className="reserva-input"
          aria-label="Fecha de la reserva"
        />
      </div>

      <div className="reserva-field">
        <label htmlFor="hora" className="reserva-label">
          Hora disponible *
        </label>
        {!hasAvailableTimes ? (
          <div className="reserva-no-available">
            No hay horarios disponibles para esta pista
          </div>
        ) : (
          <select
            id="hora"
            value={hour}
            onChange={(e) => setHour(e.target.value)}
            required
            disabled={loading || !hasAvailableTimes}
            className="reserva-select"
            aria-label="Hora disponible"
          >
            <option value="">Selecciona una hora</option>
            {displayedTimes.map((h) => (
              <option key={h} value={h}>
                {h} hs
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="reserva-field">
        <label htmlFor="duracion" className="reserva-label">
          Duración (horas) *
        </label>
        <select
          id="duracion"
          value={duracion}
          onChange={(e) => setDuracion(Number(e.target.value))}
          required
          disabled={loading}
          className="reserva-select"
          aria-label="Duración en horas"
        >
          <option value={1}>1 hora</option>
          <option value={2}>2 horas</option>
          <option value={3}>3 horas</option>
        </select>
      </div>

      {precioHora > 0 && (
        <div className="reserva-summary">
          <div className="summary-row">
            <span className="summary-label">Precio por hora:</span>
            <span className="summary-price">{precioHora.toFixed(2)}€</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Duración:</span>
            <span className="summary-price">{duracion}h</span>
          </div>
          <div className="summary-row summary-total-row">
            <span className="summary-label">Total:</span>
            <span className="summary-total">{total}€</span>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !date || !hour || !hasAvailableTimes}
        className="btn-reservar"
      >
        {loading ? (
          <>
            <span className="spinner"></span>
            Reservando...
          </>
        ) : (
          "Confirmar Reserva"
        )}
      </button>

      <p className="reserva-help-text">
        * Campos obligatorios. Asegúrate de seleccionar fecha, hora y duración
        correctas.
      </p>
    </form>
  );
}
