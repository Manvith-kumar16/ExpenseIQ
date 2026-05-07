import { useState, useEffect } from 'react';
import api from '../services/api';
import { FaWallet, FaRegCalendarAlt, FaChartPie, FaExchangeAlt, FaLightbulb } from 'react-icons/fa';
import AnimatedCounter from '../components/AnimatedCounter';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import MonthlyBarChart from '../components/charts/MonthlyBarChart';
import TrendLineChart from '../components/charts/TrendLineChart';
import { generateInsights, processCategoryData, processMonthlyData, processTrendData } from '../utils/dashboardUtils';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // MOCK BUDGET
  const MONTHLY_BUDGET = 2000;

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

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
      <div className="spinner-border text-primary" role="status"></div>
    </div>
  );

  // Data Processing
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const currentMonthExpenses = expenses.filter(exp => new Date(exp.date).getMonth() === new Date().getMonth());
  const currentMonthTotal = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  const categoryData = processCategoryData(expenses);
  const highestCategory = categoryData.length > 0 
    ? categoryData.reduce((prev, current) => (prev.value > current.value) ? prev : current).name 
    : 'N/A';

  const monthlyData = processMonthlyData(expenses);
  const trendData = processTrendData(expenses);
  const insights = generateInsights(expenses);

  const budgetProgress = Math.min((currentMonthTotal / MONTHLY_BUDGET) * 100, 100);

  return (
    <div className="animate-fade-in">
      <h2 className="mb-4 text-primary fw-bold">Analytics Dashboard</h2>

      {/* Grid Layout */}
      <div className="dashboard-grid">
        
        {/* Summary Cards */}
        <div className="dashboard-summary-card fintech-card p-4">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <h6 className="text-secondary mb-1">Total Expenses</h6>
              <h3 className="fw-bold m-0 text-primary">
                <AnimatedCounter value={totalExpenses} prefix="$" decimals={2} />
              </h3>
            </div>
            <div className="bg-light p-2 rounded text-primary"><FaWallet size={20} /></div>
          </div>
        </div>

        <div className="dashboard-summary-card fintech-card p-4">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <h6 className="text-secondary mb-1">This Month</h6>
              <h3 className="fw-bold m-0">
                <AnimatedCounter value={currentMonthTotal} prefix="$" decimals={2} />
              </h3>
            </div>
            <div className="bg-light p-2 rounded text-info"><FaRegCalendarAlt size={20} /></div>
          </div>
        </div>

        <div className="dashboard-summary-card fintech-card p-4">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <h6 className="text-secondary mb-1">Highest Category</h6>
              <h3 className="fw-bold m-0">{highestCategory}</h3>
            </div>
            <div className="bg-light p-2 rounded text-danger"><FaChartPie size={20} /></div>
          </div>
        </div>

        <div className="dashboard-summary-card fintech-card p-4">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <h6 className="text-secondary mb-1">Total Transactions</h6>
              <h3 className="fw-bold m-0">
                <AnimatedCounter value={expenses.length} />
              </h3>
            </div>
            <div className="bg-light p-2 rounded text-success"><FaExchangeAlt size={20} /></div>
          </div>
        </div>

        {/* AI Insights & Budget */}
        <div className="dashboard-insights fintech-card p-4">
          <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
            <FaLightbulb className="text-warning" /> Spending Insights
          </h5>
          <div className="row">
            <div className="col-md-8">
              <div className="d-flex flex-wrap gap-3">
                {insights.map((insight, idx) => (
                  <div key={idx} className="insight-card p-3 rounded w-100 shadow-sm">
                    <p className="m-0 fw-500">{insight}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-md-4 mt-4 mt-md-0 d-flex flex-column justify-content-center">
              <h6 className="text-secondary mb-2">Monthly Budget ($2,000)</h6>
              <div className="d-flex justify-content-between mb-1">
                <span className="fw-bold">${currentMonthTotal.toFixed(2)}</span>
                <span className="text-secondary">{budgetProgress.toFixed(0)}%</span>
              </div>
              <div className="progress-custom">
                <div 
                  className="progress-custom-bar" 
                  style={{ width: `${budgetProgress}%`, background: budgetProgress > 90 ? 'var(--danger)' : '' }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="dashboard-chart-large fintech-card p-4">
          <h5 className="fw-bold mb-4">Monthly Spending</h5>
          <div style={{ height: '300px' }}>
            <MonthlyBarChart data={monthlyData} />
          </div>
        </div>

        <div className="dashboard-chart-small fintech-card p-4">
          <h5 className="fw-bold mb-4">Categories</h5>
          <div style={{ height: '300px' }}>
            <CategoryPieChart data={categoryData} />
          </div>
        </div>

        <div className="dashboard-chart-large fintech-card p-4">
          <h5 className="fw-bold mb-4">Last 7 Days Trend</h5>
          <div style={{ height: '300px' }}>
            <TrendLineChart data={trendData} />
          </div>
        </div>

        <div className="dashboard-chart-small fintech-card p-4">
          <h5 className="fw-bold mb-4">Recent Transactions</h5>
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
            {expenses.length === 0 && <p className="text-secondary text-center py-4">No transactions found.</p>}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
