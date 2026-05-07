import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaWallet, FaChartPie, FaUser, FaSignOutAlt } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';

const Sidebar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="sidebar show d-flex flex-column">
      <div className="p-4 mb-3">
        <h3 className="text-gradient m-0 fw-bold">ExpenseIQ</h3>
      </div>
      
      <nav className="flex-grow-1">
        <NavLink to="/dashboard" className="nav-link">
          <FaHome /> Dashboard
        </NavLink>
        <NavLink to="/expenses" className="nav-link">
          <FaWallet /> Expenses
        </NavLink>
        <NavLink to="/analytics" className="nav-link">
          <FaChartPie /> Analytics
        </NavLink>
        <NavLink to="/profile" className="nav-link">
          <FaUser /> Profile
        </NavLink>
      </nav>

      <div className="p-3 mt-auto">
        <button className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
