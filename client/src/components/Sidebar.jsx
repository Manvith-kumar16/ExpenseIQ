import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Wallet, BarChart2, PiggyBank, User, LogOut, Zap, Crown } from 'lucide-react';
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
        <div className="sidebar-logo-icon">
          <Zap size={18} color="white" fill="white" />
        </div>
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

      {/* Premium Card */}
      <div className="sidebar-premium">
        <div className="premium-crown">👑</div>
        <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', marginBottom: '0.25rem' }}>Premium Member</p>
        <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginBottom: '1rem', lineHeight: 1.4 }}>
          You're enjoying all premium features
        </p>
        <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
          <Crown size={14} /> View Benefits
        </button>
      </div>

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
