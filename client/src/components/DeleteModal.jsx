import { Modal, Button } from 'react-bootstrap';
import { FaExclamationTriangle } from 'react-icons/fa';

const DeleteModal = ({ show, handleClose, handleConfirm, isDeleting }) => {
  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static">
      <Modal.Body className="text-center p-5">
        <FaExclamationTriangle size={50} className="text-warning mb-4" />
        <h4 className="fw-bold mb-3">Delete Expense?</h4>
        <p className="text-secondary mb-4">
          Are you sure you want to delete this expense? This action cannot be undone.
        </p>
        <div className="d-flex justify-content-center gap-3">
          <Button variant="light" className="px-4" onClick={handleClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="danger" className="px-4" onClick={handleConfirm} disabled={isDeleting}>
            {isDeleting ? <span className="spinner-border spinner-border-sm"></span> : 'Yes, Delete'}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DeleteModal;
