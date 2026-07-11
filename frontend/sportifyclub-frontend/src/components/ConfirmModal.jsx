import "../styles/ConfirmModal.css";

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
  loading = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="confirm-modal-overlay" role="dialog" aria-modal="true">
      <div className="confirm-modal-card">
        <h3 className="confirm-modal-title">{title}</h3>
        <p className="confirm-modal-message">{message}</p>

        <div className="confirm-modal-actions">
          <button
            type="button"
            className="confirm-modal-btn neutral"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className="confirm-modal-btn danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Procesando..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
