import { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const CATEGORIES = ['Housing', 'Food', 'Transportation', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Other'];

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: '', amount: '', category: CATEGORIES[0], date: new Date().toISOString().split('T')[0], description: '' });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await api.get('/expenses');
      setExpenses(res.data.data);
    } catch (error) {
      toast.error('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/expenses', formData);
      toast.success('Expense added successfully');
      setFormData({ title: '', amount: '', category: CATEGORIES[0], date: new Date().toISOString().split('T')[0], description: '' });
      fetchExpenses();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add expense');
    }
  };

  const deleteExpense = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await api.delete(`/expenses/${id}`);
        toast.success('Expense deleted');
        fetchExpenses();
      } catch (error) {
        toast.error('Failed to delete expense');
      }
    }
  };

  return (
    <div className="animate-fade-in row">
      <div className="col-md-4 mb-4">
        <div className="fintech-card p-4 sticky-top" style={{ top: '2rem' }}>
          <h5 className="fw-bold mb-4">Add New Expense</h5>
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label className="form-label text-secondary fw-500">Title</label>
              <input type="text" className="form-control" name="title" value={formData.title} onChange={onChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label text-secondary fw-500">Amount</label>
              <div className="input-group">
                <span className="input-group-text">$</span>
                <input type="number" step="0.01" min="0" className="form-control" name="amount" value={formData.amount} onChange={onChange} required />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label text-secondary fw-500">Category</label>
              <select className="form-select" name="category" value={formData.category} onChange={onChange}>
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label text-secondary fw-500">Date</label>
              <input type="date" className="form-control" name="date" value={formData.date} onChange={onChange} required />
            </div>
            <div className="mb-4">
              <label className="form-label text-secondary fw-500">Description (Optional)</label>
              <textarea className="form-control" name="description" value={formData.description} onChange={onChange} rows="2"></textarea>
            </div>
            <button type="submit" className="btn-primary-custom w-100">Save Expense</button>
          </form>
        </div>
      </div>

      <div className="col-md-8">
        <div className="fintech-card p-4">
          <h5 className="fw-bold mb-4">All Expenses</h5>
          {loading ? (
            <p>Loading...</p>
          ) : expenses.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th className="text-secondary fw-500 border-0">Date</th>
                    <th className="text-secondary fw-500 border-0">Title</th>
                    <th className="text-secondary fw-500 border-0">Category</th>
                    <th className="text-secondary fw-500 border-0">Amount</th>
                    <th className="text-secondary fw-500 border-0">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map(expense => (
                    <tr key={expense._id}>
                      <td>{new Date(expense.date).toLocaleDateString()}</td>
                      <td className="fw-bold">{expense.title}</td>
                      <td><span className="badge bg-light text-dark border">{expense.category}</span></td>
                      <td className="fw-bold text-danger">-${expense.amount.toFixed(2)}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => deleteExpense(expense._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5">
              <p className="text-secondary mb-0">No expenses recorded yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Expenses;
