import React from 'react';
import './ConfirmationModal.css';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3 className="modal-title">{title}</h3>
                <p className="modal-message">{message}</p>
                <div className="modal-actions">
                    <button className="modal-button cancel" onClick={onClose}>
                        Batal
                    </button>
                    <button className="modal-button confirm" onClick={onConfirm}>
                        Ya, Hapus
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
