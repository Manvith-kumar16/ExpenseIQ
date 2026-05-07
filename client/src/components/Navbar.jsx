import { useContext } from 'react';
import { Search, Bell, Sun, Moon } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import ThemeContext from '../context/ThemeContext';

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const initials = user?.name?.charAt(0).toUpperCase() || 'M';

  return (
    <header className="top-navbar">
      {/* Search */}
      <div className="search-bar">
        <Search size={15} color="#475569" />
        <input type="text" placeholder="Search expenses..." />
        <span className="kbd">⌘ K</span>
      </div>

      {/* Right actions */}
      <div className="navbar-actions">
        {/* Theme toggle */}
        <button className="icon-btn" onClick={toggleTheme} title="Toggle theme">
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        {/* Notifications */}
        <div className="icon-btn">
          <Bell size={16} />
          <span className="notif-badge">3</span>
        </div>

        {/* User avatar */}
        <div className="user-avatar">{initials}</div>

        {/* User info (desktop) */}
        <div className="d-none d-lg-block" style={{ lineHeight: 1.2 }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user?.name || 'User'}</div>
          <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Premium Member</div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
