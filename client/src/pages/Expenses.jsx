import { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { FaPlus, FaSearch, FaFilter, FaSort, FaEdit, FaTrash, FaWallet } from 'react-icons/fa';
import ExpenseModal from '../components/ExpenseModal';
import DeleteModal from '../components/DeleteModal';
import ExpenseSkeleton from '../components/ExpenseSkeleton';

const CATEGORY_COLORS = {
  Food: 'bg-warning text-dark',
  Travel: 'bg-info text-white',
  Shopping: 'bg-danger text-white',
  Bills: 'bg-primary text-white',
  Entertainment: 'bg-secondary text-white',
  Health: 'bg-success text-white',
  Education: 'bg-dark text-white',
  Other: 'bg-light text-dark border'
};

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filters & Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortBy, setSortBy] = useState('dateDesc');

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/expenses');
      setExpenses(res.data.data);
    } catch (error) {
      toast.error('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  // Handlers for Add/Edit
  const handleAddClick = () => {
    setSelectedExpense(null);
    setShowExpenseModal(true);
  };

  const handleEditClick = (expense) => {
    setSelectedExpense(expense);
    setShowExpenseModal(true);
  };

  const handleSaveExpense = async (formData) => {
    try {
      if (selectedExpense) {
        await api.put(`/expenses/${selectedExpense._id}`, formData);
        toast.success('Expense updated successfully');
      } else {
        await api.post('/expenses', formData);
        toast.success('Expense added successfully');
      }
      setShowExpenseModal(false);
      fetchExpenses();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  // Handlers for Delete
  const handleDeleteClick = (expense) => {
    setSelectedExpense(expense);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/expenses/${selectedExpense._id}`);
      toast.success('Expense deleted');
      setShowDeleteModal(false);
      fetchExpenses();
    } catch (error) {
      toast.error('Failed to delete expense');
    } finally {
      setIsDeleting(false);
    }
  };

  // Derived State (Filtering and Sorting)
  const getFilteredAndSortedExpenses = () => {
    let filtered = expenses.filter(exp => {
      const matchesSearch = exp.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'All' || exp.category === filterCategory;
      return matchesSearch && matchesCategory;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'dateDesc': return new Date(b.date) - new Date(a.date);
        case 'dateAsc': return new Date(a.date) - new Date(b.date);
        case 'amountDesc': return b.amount - a.amount;
        case 'amountAsc': return a.amount - b.amount;
        default: return 0;
      }
    });
  };

  const processedExpenses = getFilteredAndSortedExpenses();

  return (
    <div className="animate-fade-in">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <h2 className="fw-bold text-primary m-0">My Expenses</h2>
        <button className="btn btn-primary-custom d-flex align-items-center gap-2" onClick={handleAddClick}>
          <FaPlus /> Add Expense
        </button>
      </div>

      <div className="fintech-card p-4 mb-4">
        <div className="row g-3">
          <div className="col-md-4">
            <div className="input-group">
              <span className="input-group-text bg-white"><FaSearch className="text-secondary" /></span>
              <input 
                type="text" 
                className="form-control border-start-0 ps-0" 
                placeholder="Search expenses..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="input-group">
              <span className="input-group-text bg-white"><FaFilter className="text-secondary" /></span>
              <select className="form-select border-start-0 ps-0" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                <option value="All">All Categories</option>
                <option value="Food">Food</option>
                <option value="Travel">Travel</option>
                <option value="Shopping">Shopping</option>
                <option value="Bills">Bills</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Health">Health</option>
                <option value="Education">Education</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div className="col-md-4">
            <div className="input-group">
              <span className="input-group-text bg-white"><FaSort className="text-secondary" /></span>
              <select className="form-select border-start-0 ps-0" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="dateDesc">Newest First</option>
                <option value="dateAsc">Oldest First</option>
                <option value="amountDesc">Highest Amount</option>
                <option value="amountAsc">Lowest Amount</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="fintech-card p-4">
        {loading ? (
          <ExpenseSkeleton />
        ) : processedExpenses.length > 0 ? (
          <>
            {/* Desktop Table */}
            <div className="table-responsive d-none d-md-block">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th className="text-secondary fw-500 border-0">Date</th>
                    <th className="text-secondary fw-500 border-0">Title</th>
                    <th className="text-secondary fw-500 border-0">Category</th>
                    <th className="text-secondary fw-500 border-0">Payment Method</th>
                    <th className="text-secondary fw-500 border-0">Amount</th>
                    <th className="text-secondary fw-500 border-0 text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {processedExpenses.map(expense => (
                    <tr key={expense._id} className="expense-row">
                      <td className="text-secondary">{new Date(expense.date).toLocaleDateString()}</td>
                      <td>
                        <div className="fw-bold">{expense.title}</div>
                        {expense.description && <small className="text-secondary d-block text-truncate" style={{maxWidth: '200px'}}>{expense.description}</small>}
                      </td>
                      <td><span className={`badge ${CATEGORY_COLORS[expense.category]}`}>{expense.category}</span></td>
                      <td className="text-secondary">{expense.paymentMethod}</td>
                      <td className="fw-bold text-danger">-${expense.amount.toFixed(2)}</td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-light me-2 text-primary" onClick={() => handleEditClick(expense)}><FaEdit /></button>
                        <button className="btn btn-sm btn-light text-danger" onClick={() => handleDeleteClick(expense)}><FaTrash /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="d-md-none">
              {processedExpenses.map(expense => (
                <div key={expense._id} className="expense-mobile-card">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h6 className="fw-bold m-0">{expense.title}</h6>
                      <small className="text-secondary">{new Date(expense.date).toLocaleDateString()}</small>
                    </div>
                    <span className="fw-bold text-danger fs-5">-${expense.amount.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="d-flex gap-2">
                      <span className={`badge ${CATEGORY_COLORS[expense.category]}`}>{expense.category}</span>
                      <small className="text-secondary">{expense.paymentMethod}</small>
                    </div>
                    <div>
                      <button className="btn btn-sm btn-light me-2 text-primary" onClick={() => handleEditClick(expense)}><FaEdit /></button>
                      <button className="btn btn-sm btn-light text-danger" onClick={() => handleDeleteClick(expense)}><FaTrash /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="empty-state">
            <FaWallet size={60} className="text-secondary opacity-50 mb-3" />
            <h4 className="fw-bold text-secondary">No Expenses Found</h4>
            <p className="text-secondary mb-4">You have no expenses matching your criteria. Add a new expense to get started.</p>
            <button className="btn btn-primary-custom" onClick={handleAddClick}>
              <FaPlus className="me-2" /> Add Expense
            </button>
          </div>
        )}
      </div>

      <ExpenseModal 
        show={showExpenseModal} 
        handleClose={() => setShowExpenseModal(false)} 
        handleSave={handleSaveExpense} 
        initialData={selectedExpense} 
      />

      <DeleteModal 
        show={showDeleteModal} 
        handleClose={() => setShowDeleteModal(false)} 
        handleConfirm={confirmDelete} 
        isDeleting={isDeleting} 
      />
    </div>
  );
};

export default Expenses;
