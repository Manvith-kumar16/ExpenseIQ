import { useState, useEffect } from 'react';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const Analytics = () => {
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

  // Process data for charts
  const categoryData = expenses.reduce((acc, expense) => {
    const existing = acc.find(item => item.name === expense.category);
    if (existing) {
      existing.amount += expense.amount;
    } else {
      acc.push({ name: expense.category, amount: expense.amount });
    }
    return acc;
  }, []);

  const timelineData = expenses
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .reduce((acc, expense) => {
      const date = new Date(expense.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      const existing = acc.find(item => item.date === date);
      if (existing) {
        existing.amount += expense.amount;
      } else {
        acc.push({ date, amount: expense.amount });
      }
      return acc;
    }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="animate-fade-in">
      <h2 className="mb-4 text-primary fw-bold">Analytics & Insights</h2>

      <div className="row">
        <div className="col-12 mb-4">
          <div className="fintech-card p-4">
            <h5 className="mb-4 fw-bold">Expense Timeline</h5>
            {timelineData.length > 0 ? (
              <div style={{ height: '350px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timelineData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="date" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip formatter={(value) => `$${value.toFixed(2)}`} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                    <Line type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={3} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-secondary text-center py-5">No timeline data available.</p>
            )}
          </div>
        </div>

        <div className="col-12 mb-4">
          <div className="fintech-card p-4">
            <h5 className="mb-4 fw-bold">Category Breakdown</h5>
            {categoryData.length > 0 ? (
              <div style={{ height: '350px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip formatter={(value) => `$${value.toFixed(2)}`} cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-secondary text-center py-5">No category data available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
