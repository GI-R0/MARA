import React, { useState, useEffect, useCallback } from "react";
import API from "../api/axiosConfig";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import {
  Plus,
  Edit,
  Trash2,
  X,
  Check,
  MapPin,
  DollarSign,
  Activity,
} from "lucide-react";
import "../styles/GestionPistas.css";

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80";

export default function GestionPistas() {
  const { user } = useAuth();
  const [pistas, setPistas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPista, setEditingPista] = useState(null);

  const [formData, setFormData] = useState({
    nombre: "",
    deporte: "Pádel",
    precioHora: 10,
    ubicacion: "",
    horariosDisponibles:
      "09:00, 10:00, 11:00, 12:00, 16:00, 17:00, 18:00, 19:00, 20:00, 21:00",
    imagen: "",
    iluminacion: false,
    superficie: "Césped",
  });

  const fetchPistas = useCallback(async () => {
    try {
      setLoading(true);
      let url = "/pistas";
      if (user && user.role === "club") {
        url = `/pistas/club/${user._id}`;
      }

      const res = await API.get(url);
      setPistas(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching pistas:", err);
      setError("No se pudieron cargar las pistas.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPistas();
  }, [fetchPistas]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const openModal = (pista = null) => {
    if (pista) {
      setEditingPista(pista);
      setFormData({
        ...pista,
        horariosDisponibles: pista.horariosDisponibles.join(", "),
      });
    } else {
      setEditingPista(null);
      setFormData({
        nombre: "",
        deporte: "Pádel",
        precioHora: 10,
        ubicacion: "",
        horariosDisponibles:
          "09:00, 10:00, 11:00, 12:00, 16:00, 17:00, 18:00, 19:00, 20:00, 21:00",
        imagen: "",
        iluminacion: false,
        superficie: "Césped",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPista(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        horariosDisponibles: formData.horariosDisponibles
          .split(",")
          .map((h) => h.trim())
          .filter((h) => h),
      };

      if (editingPista) {
        await API.put(`/pistas/${editingPista._id}`, payload);
      } else {
        await API.post("/pistas", payload);
      }

      closeModal();
      fetchPistas();
      toast.success(editingPista ? "Pista actualizada" : "Pista creada exitosamente");
    } catch (err) {
      console.error("Error saving pista:", err);
      toast.error("Error al guardar la pista");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta pista?"))
      return;
    try {
      await API.delete(`/pistas/${id}`);
      toast.success("Pista eliminada");
      fetchPistas();
    } catch (err) {
      console.error("Error deleting pista:", err);
      toast.error("Error al eliminar la pista");
    }
  };

  if (loading)
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-spinner-lg"></div>
          <p className="loading-text">Cargando pistas...</p>
        </div>
      </div>
    );

  return (
    <div className="gestion-pistas-page">
      <div className="gestion-container">
        <div className="gestion-header">
          <div>
            <h1 className="gestion-title">Gestión de Pistas</h1>
            <p className="gestion-subtitle">
              Administra tus instalaciones deportivas
            </p>
          </div>
          <button onClick={() => openModal()} className="btn-add">
            <Plus size={20} />
            Nueva Pista
          </button>
        </div>

        {error && <div className="error-alert">{error}</div>}

        <div className="gestion-grid">
          {pistas.map((pista) => (
            <div key={pista._id} className="pista-manage-card">
              <div className="pista-manage-image-container">
                <img
                  src={
                    pista.imagen || DEFAULT_IMAGE
                  }
                  alt={pista.nombre}
                  className="pista-manage-image"
                />
                <div className="pista-manage-badge">{pista.deporte}</div>
              </div>

              <div className="pista-manage-content">
                <h3 className="pista-manage-title">{pista.nombre}</h3>

                <div className="pista-manage-info">
                  <div className="info-row">
                    <MapPin size={16} />
                    <span>{pista.ubicacion || "Sin ubicación"}</span>
                  </div>
                  <div className="info-row">
                    <DollarSign size={16} />
                    <span>{pista.precioHora}€ / hora</span>
                  </div>
                  <div className="info-row">
                    <Activity size={16} />
                    <span>{pista.superficie}</span>
                  </div>
                </div>

                <div className="pista-manage-actions">
                  <button onClick={() => openModal(pista)} className="btn-edit">
                    <Edit size={18} />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(pista._id)}
                    className="btn-delete"
                  >
                    <Trash2 size={18} />
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {pistas.length === 0 && !loading && !error && (
          <div className="gestion-empty">
            <p className="empty-text">No hay pistas registradas aún.</p>
            <button onClick={() => openModal()} className="btn-create-first">
              Crear la primera pista
            </button>
          </div>
        )}

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">
                  {editingPista ? "Editar Pista" : "Nueva Pista"}
                </h2>
                <button onClick={closeModal} className="btn-close">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="modal-body">
                <div className="form-grid">
                  <div>
                    <label className="form-label">Nombre</label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                      placeholder="Ej: Pista Central"
                    />
                  </div>

                  <div>
                    <label className="form-label">Deporte</label>
                    <select
                      name="deporte"
                      value={formData.deporte}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="Pádel">Pádel</option>
                      <option value="Tenis">Tenis</option>
                      <option value="Fútbol">Fútbol</option>
                      <option value="Baloncesto">Baloncesto</option>
                      <option value="Voleibol">Voleibol</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Precio / Hora (€)</label>
                    <input
                      type="number"
                      name="precioHora"
                      value={formData.precioHora}
                      onChange={handleInputChange}
                      min="0"
                      required
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="form-label">Superficie</label>
                    <select
                      name="superficie"
                      value={formData.superficie}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="Césped">Césped</option>
                      <option value="Arcilla">Arcilla</option>
                      <option value="Cemento">Cemento</option>
                      <option value="Hierba artificial">
                        Hierba artificial
                      </option>
                      <option value="Madera">Madera</option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="form-label">Ubicación</label>
                    <input
                      type="text"
                      name="ubicacion"
                      value={formData.ubicacion}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Ej: Zona Norte, Pista 3"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="form-label">URL de Imagen</label>
                    <input
                      type="text"
                      name="imagen"
                      value={formData.imagen}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Ej: https://misitio.com/pista.jpg"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="form-label">
                      Horarios Disponibles (separados por coma)
                    </label>
                    <textarea
                      name="horariosDisponibles"
                      value={formData.horariosDisponibles}
                      onChange={handleInputChange}
                      rows="3"
                      className="form-textarea"
                      placeholder="09:00, 10:00, 11:00..."
                    />
                    <p className="form-help">Formato HH:MM</p>
                  </div>

                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      name="iluminacion"
                      checked={formData.iluminacion}
                      onChange={handleInputChange}
                      id="iluminacion"
                      className="form-checkbox"
                    />
                    <label
                      htmlFor="iluminacion"
                      className="form-label"
                      style={{ marginBottom: 0 }}
                    >
                      Tiene Iluminación
                    </label>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="btn-cancel"
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-save">
                    <Check size={20} />
                    {editingPista ? "Guardar Cambios" : "Crear Pista"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
