import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Wallet, BarChart2, User, LogOut } from 'lucide-react';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/expenses',  icon: Wallet,          label: 'Expenses' },
  { to: '/analytics', icon: BarChart2,        label: 'Analytics' },
  { to: '/profile',   icon: User,             label: 'Profile' },
];

const Sidebar = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <img
          src="/logo.png"
          alt="ExpenseIQ Logo"
          style={{ width: 36, height: 36, borderRadius: 10, objectFit: 'cover' }}
        />
        <span className="sidebar-logo-text">ExpenseIQ</span>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Main Menu</div>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-item-icon"><Icon size={17} /></span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="sidebar-logout">
        <button className="sidebar-logout-btn" onClick={handleLogout}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
