import { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { FaWallet, FaRegCalendarAlt, FaChartPie, FaExchangeAlt, FaLightbulb, FaEdit, FaExclamationTriangle } from 'react-icons/fa';
import AnimatedCounter from '../components/AnimatedCounter';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import MonthlyBarChart from '../components/charts/MonthlyBarChart';
import TrendLineChart from '../components/charts/TrendLineChart';
import BudgetModal from '../components/BudgetModal';
import { generateInsights, processCategoryData, processMonthlyData, processTrendData } from '../utils/dashboardUtils';
import { Alert } from 'react-bootstrap';
import AuthContext from '../context/AuthContext';
import { useContext } from 'react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showBudgetModal, setShowBudgetModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expRes, budRes] = await Promise.all([
          api.get('/expenses'),
          api.get('/budget')
        ]);
        setExpenses(expRes.data.data);
        setBudget(budRes.data.data.amount);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSaveBudget = async (amount) => {
    try {
      const res = await api.post('/budget', { amount });
      setBudget(res.data.data.amount);
      setShowBudgetModal(false);
      toast.success('Budget updated successfully');
    } catch (error) {
      toast.error('Failed to update budget');
    }
  };

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

  // Budget Calculations
  const budgetProgress = budget > 0 ? Math.min((currentMonthTotal / budget) * 100, 100) : 0;
  const remainingBalance = budget > 0 ? Math.max(budget - currentMonthTotal, 0) : 0;
  
  let progressColorClass = 'progress-green';
  let alertElement = null;

  if (budgetProgress > 90) {
    progressColorClass = 'progress-red';
    alertElement = (
      <Alert variant="danger" className="d-flex align-items-center mb-4 border-0 shadow-sm">
        <FaExclamationTriangle className="me-3 fs-4" />
        <div>
          <h6 className="mb-1 fw-bold">Critical Alert: Budget Limit Reached!</h6>
          <p className="mb-0">You have used {budgetProgress.toFixed(0)}% of your monthly budget. Please hold off on unnecessary expenses.</p>
        </div>
      </Alert>
    );
  } else if (budgetProgress > 75) {
    progressColorClass = 'progress-yellow';
    alertElement = (
      <Alert variant="warning" className="d-flex align-items-center mb-4 border-0 shadow-sm">
        <FaExclamationTriangle className="me-3 fs-4" />
        <div>
          <h6 className="mb-1 fw-bold">Warning: Nearing Budget Limit</h6>
          <p className="mb-0">You have used {budgetProgress.toFixed(0)}% of your monthly budget. Watch your spending closely!</p>
        </div>
      </Alert>
    );
  }

  // Welcome Greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <h2 className="text-primary fw-bold mb-1">{getGreeting()}, {user?.name?.split(' ')[0] || 'User'}!</h2>
        <p className="text-secondary m-0">Here's your financial overview for today, {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}.</p>
      </div>

      {alertElement}

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
          <div className="row">
            {/* Insights */}
            <div className="col-md-7 mb-4 mb-md-0 border-end border-md-0">
              <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                <FaLightbulb className="text-warning" /> Spending Insights
              </h5>
              <div className="d-flex flex-wrap gap-3">
                {insights.map((insight, idx) => (
                  <div key={idx} className="insight-card p-3 rounded w-100 shadow-sm">
                    <p className="m-0 fw-500">{insight}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Budget Section */}
            <div className="col-md-5 d-flex flex-column justify-content-center ps-md-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold m-0">Monthly Budget</h5>
                <button className="btn btn-sm btn-outline-primary" onClick={() => setShowBudgetModal(true)}>
                  <FaEdit className="me-1" /> Edit
                </button>
              </div>

              {budget === 0 ? (
                <div className="text-center bg-light p-4 rounded border border-dashed">
                  <p className="text-secondary mb-2">No budget set for this month.</p>
                  <button className="btn btn-primary-custom btn-sm" onClick={() => setShowBudgetModal(true)}>Set Budget</button>
                </div>
              ) : (
                <>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-secondary">Used: <span className="fw-bold text-dark">${currentMonthTotal.toFixed(2)}</span></span>
                    <span className="text-secondary">Limit: <span className="fw-bold text-dark">${budget.toFixed(2)}</span></span>
                  </div>
                  
                  <div className="progress-custom mb-3">
                    <div 
                      className={`progress-custom-bar ${progressColorClass}`} 
                      style={{ width: `${budgetProgress}%` }}
                    ></div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <small className="text-secondary d-block">Remaining Balance</small>
                      <span className={`fw-bold fs-5 ${remainingBalance === 0 ? 'text-danger' : 'text-success'}`}>
                        ${remainingBalance.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-end">
                      <small className="text-secondary d-block">Percentage Used</small>
                      <span className="fw-bold">{budgetProgress.toFixed(1)}%</span>
                    </div>
                  </div>
                </>
              )}
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

      <BudgetModal 
        show={showBudgetModal} 
        handleClose={() => setShowBudgetModal(false)} 
        handleSave={handleSaveBudget}
        currentBudget={budget}
      />
    </div>
  );
};

export default Dashboard;
