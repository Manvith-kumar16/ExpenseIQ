import { useState, useEffect } from 'react';
import api from '../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

const COLORS = ['#6366f1', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#64748b'];

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await api.get('/expenses');
        setExpenses(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  // Group by category for pie chart
  const categoryData = expenses.reduce((acc, expense) => {
    const existing = acc.find(item => item.name === expense.category);
    if (existing) {
      existing.value += expense.amount;
    } else {
      acc.push({ name: expense.category, value: expense.amount });
    }
    return acc;
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="animate-fade-in">
      <h2 className="mb-4 text-primary fw-bold">Dashboard Overview</h2>
      
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="fintech-card p-4 bg-gradient-primary">
            <h5 className="mb-2 text-white-50">Total Expenses</h5>
            <h2 className="m-0">${totalExpenses.toFixed(2)}</h2>
          </div>
        </div>
        <div className="col-md-4">
          <div className="fintech-card p-4">
            <h5 className="mb-2 text-secondary">Transaction Count</h5>
            <h2 className="m-0 text-primary">{expenses.length}</h2>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="fintech-card p-4 h-100">
            <h5 className="mb-4 fw-bold">Expenses by Category</h5>
            {categoryData.length > 0 ? (
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(value) => `$${value.toFixed(2)}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-secondary text-center py-5">No expense data available.</p>
            )}
          </div>
        </div>
        
        <div className="col-md-6 mb-4">
          <div className="fintech-card p-4 h-100">
            <h5 className="mb-4 fw-bold">Recent Transactions</h5>
            <div className="list-group list-group-flush">
              {expenses.slice(0, 5).map(expense => (
                <div key={expense._id} className="list-group-item d-flex justify-content-between align-items-center px-0 py-3 border-bottom">
                  <div>
                    <h6 className="m-0 fw-bold">{expense.title}</h6>
                    <small className="text-secondary">{new Date(expense.date).toLocaleDateString()} &bull; {expense.category}</small>
                  </div>
                  <span className="fw-bold text-danger">-${expense.amount.toFixed(2)}</span>
                </div>
              ))}
              {expenses.length === 0 && <p className="text-secondary text-center py-4">No recent transactions.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
