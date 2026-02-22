import "../styles/modal.css";

function Modal({ isOpen, onClose, onConfirm, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2 className="modal-title">{title}</h2>

        <div className="modal-body">
          {children}
        </div>

        <div className="modal-actions">
          <button
            className="modal-cancel"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="modal-confirm"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;