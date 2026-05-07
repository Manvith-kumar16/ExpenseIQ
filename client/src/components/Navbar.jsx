import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import ThemeContext from '../context/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="top-navbar">
      <div className="d-flex align-items-center gap-4">
        <button 
          onClick={toggleTheme} 
          className="btn btn-link text-secondary p-0 text-decoration-none"
          title="Toggle Theme"
        >
          {theme === 'light' ? <FaMoon size={20} /> : <FaSun size={20} />}
        </button>
        <div className="d-flex align-items-center gap-3">
          <div className="text-end">
            <p className="m-0 fw-bold">{user?.name || 'User'}</p>
            <small className="text-secondary">Premium Member</small>
          </div>
        <div 
          className="bg-gradient-primary rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
          style={{ width: '40px', height: '40px' }}
        >
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
