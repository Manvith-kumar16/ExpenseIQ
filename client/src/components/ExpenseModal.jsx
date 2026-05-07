import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const CATEGORIES = ['Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Education', 'Other'];
const PAYMENT_METHODS = ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Other'];

const ExpenseModal = ({ show, handleClose, handleSave, initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: CATEGORIES[0],
    paymentMethod: PAYMENT_METHODS[0],
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        amount: initialData.amount || '',
        category: initialData.category || CATEGORIES[0],
        paymentMethod: initialData.paymentMethod || PAYMENT_METHODS[0],
        date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        description: initialData.description || ''
      });
    } else {
      // Reset form
      setFormData({
        title: '',
        amount: '',
        category: CATEGORIES[0],
        paymentMethod: PAYMENT_METHODS[0],
        date: new Date().toISOString().split('T')[0],
        description: ''
      });
    }
  }, [initialData, show]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await handleSave(formData);
    setIsSubmitting(false);
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">{initialData ? 'Edit Expense' : 'Add New Expense'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label className="text-secondary fw-500">Title</Form.Label>
            <Form.Control type="text" name="title" value={formData.title} onChange={onChange} required placeholder="E.g., Groceries" />
          </Form.Group>
          
          <div className="row">
            <Form.Group className="mb-3 col-md-6">
              <Form.Label className="text-secondary fw-500">Amount</Form.Label>
              <div className="input-group">
                <span className="input-group-text">$</span>
                <Form.Control type="number" step="0.01" min="0" name="amount" value={formData.amount} onChange={onChange} required />
              </div>
            </Form.Group>

            <Form.Group className="mb-3 col-md-6">
              <Form.Label className="text-secondary fw-500">Date</Form.Label>
              <Form.Control type="date" name="date" value={formData.date} onChange={onChange} required />
            </Form.Group>
          </div>

          <div className="row">
            <Form.Group className="mb-3 col-md-6">
              <Form.Label className="text-secondary fw-500">Category</Form.Label>
              <Form.Select name="category" value={formData.category} onChange={onChange}>
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3 col-md-6">
              <Form.Label className="text-secondary fw-500">Payment Method</Form.Label>
              <Form.Select name="paymentMethod" value={formData.paymentMethod} onChange={onChange}>
                {PAYMENT_METHODS.map(method => <option key={method} value={method}>{method}</option>)}
              </Form.Select>
            </Form.Group>
          </div>

          <Form.Group className="mb-3">
            <Form.Label className="text-secondary fw-500">Description (Optional)</Form.Label>
            <Form.Control as="textarea" rows={2} name="description" value={formData.description} onChange={onChange} placeholder="Additional details..." />
          </Form.Group>

        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" className="btn-primary-custom" disabled={isSubmitting}>
            {isSubmitting ? (
              <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</>
            ) : 'Save Expense'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ExpenseModal;
