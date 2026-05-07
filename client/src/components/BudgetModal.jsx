import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const BudgetModal = ({ show, handleClose, handleSave, currentBudget }) => {
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (show) {
      setAmount(currentBudget || '');
    }
  }, [show, currentBudget]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await handleSave(Number(amount));
    setIsSubmitting(false);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">Set Monthly Budget</Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label className="text-secondary fw-500">Monthly Budget Amount</Form.Label>
            <div className="input-group">
              <span className="input-group-text">$</span>
              <Form.Control 
                type="number" 
                step="0.01" 
                min="0" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                required 
                placeholder="e.g., 2000"
              />
            </div>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" className="btn-primary-custom" disabled={isSubmitting}>
            {isSubmitting ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
            Save Budget
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default BudgetModal;
