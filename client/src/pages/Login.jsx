import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const success = await login(formData);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-background">
      <div className="fintech-card p-5" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="text-center mb-4">
          <h2 className="text-gradient fw-bold mb-2">ExpenseIQ</h2>
          <p className="text-secondary">Sign in to your account</p>
        </div>

        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label text-secondary fw-500">Email Address</label>
            <input 
              type="email" 
              className="form-control p-2" 
              name="email" 
              value={formData.email} 
              onChange={onChange} 
              required 
            />
          </div>
          <div className="mb-4">
            <label className="form-label text-secondary fw-500">Password</label>
            <input 
              type="password" 
              className="form-control p-2" 
              name="password" 
              value={formData.password} 
              onChange={onChange} 
              required 
            />
          </div>
          <button type="submit" className="btn-primary-custom w-100 mb-3">Sign In</button>
        </form>

        <p className="text-center text-secondary m-0">
          Don't have an account? <Link to="/register" className="text-primary text-decoration-none fw-bold">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
