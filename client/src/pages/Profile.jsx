import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { FaUserCircle, FaEnvelope, FaKey, FaShieldAlt } from 'react-icons/fa';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Profile = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="animate-fade-in row justify-content-center">
      <div className="col-lg-8">
        <h2 className="mb-4 text-primary fw-bold">My Profile</h2>
        
        <Card className="mb-4 text-center border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)', color: 'white' }}>
          <div 
            className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center fw-bold mb-3 shadow-lg"
            style={{ width: '100px', height: '100px', fontSize: '2.5rem', color: 'var(--primary)' }}
          >
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <h3 className="fw-bold">{user?.name || 'User'}</h3>
          <p className="opacity-75 mb-0 d-flex align-items-center justify-content-center gap-2">
            <FaShieldAlt /> Premium Member Since {user?.createdAt ? new Date(user.createdAt).getFullYear() : '2026'}
          </p>
        </Card>

        <Card>
          <h5 className="fw-bold mb-4">Account Information</h5>
          
          <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
            <div className="bg-light p-3 rounded-circle text-primary me-3">
              <FaUserCircle size={24} />
            </div>
            <div className="flex-grow-1">
              <small className="text-secondary d-block">Full Name</small>
              <span className="fw-500">{user?.name || 'N/A'}</span>
            </div>
            <Button variant="outline-primary" size="sm" disabled>Edit</Button>
          </div>
          
          <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
            <div className="bg-light p-3 rounded-circle text-primary me-3">
              <FaEnvelope size={24} />
            </div>
            <div className="flex-grow-1">
              <small className="text-secondary d-block">Email Address</small>
              <span className="fw-500">{user?.email || 'N/A'}</span>
            </div>
            <Button variant="outline-primary" size="sm" disabled>Edit</Button>
          </div>
          
          <div className="d-flex align-items-center">
            <div className="bg-light p-3 rounded-circle text-primary me-3">
              <FaKey size={24} />
            </div>
            <div className="flex-grow-1">
              <small className="text-secondary d-block">Password</small>
              <span className="fw-500">••••••••</span>
            </div>
            <Button variant="outline-primary" size="sm" disabled>Update</Button>
          </div>

          <div className="mt-4 pt-3 text-center">
            <small className="text-secondary">Note: Profile updates are currently disabled in this demo environment.</small>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
