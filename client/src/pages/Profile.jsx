import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { FaUserCircle, FaEnvelope, FaKey } from 'react-icons/fa';

const Profile = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="animate-fade-in row justify-content-center">
      <div className="col-md-8">
        <h2 className="mb-4 text-primary fw-bold">My Profile</h2>
        
        <div className="fintech-card p-4 mb-4 text-center">
          <div 
            className="bg-gradient-primary rounded-circle d-inline-flex align-items-center justify-content-center text-white fw-bold mb-3 shadow-md"
            style={{ width: '100px', height: '100px', fontSize: '2.5rem' }}
          >
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <h3 className="fw-bold">{user?.name || 'User'}</h3>
          <p className="text-secondary mb-0">Premium Member Since {user?.createdAt ? new Date(user.createdAt).getFullYear() : '2026'}</p>
        </div>

        <div className="fintech-card p-4">
          <h5 className="fw-bold mb-4">Account Information</h5>
          
          <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
            <div className="bg-light p-3 rounded-circle text-primary me-3">
              <FaUserCircle size={24} />
            </div>
            <div>
              <small className="text-secondary d-block">Full Name</small>
              <span className="fw-500">{user?.name || 'N/A'}</span>
            </div>
          </div>
          
          <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
            <div className="bg-light p-3 rounded-circle text-primary me-3">
              <FaEnvelope size={24} />
            </div>
            <div>
              <small className="text-secondary d-block">Email Address</small>
              <span className="fw-500">{user?.email || 'N/A'}</span>
            </div>
          </div>
          
          <div className="d-flex align-items-center">
            <div className="bg-light p-3 rounded-circle text-primary me-3">
              <FaKey size={24} />
            </div>
            <div>
              <small className="text-secondary d-block">Password</small>
              <span className="fw-500">••••••••</span>
            </div>
            <button className="btn btn-outline-primary btn-sm ms-auto">Update</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
