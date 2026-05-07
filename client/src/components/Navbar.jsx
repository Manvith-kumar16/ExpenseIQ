import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="top-navbar">
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
