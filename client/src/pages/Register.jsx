import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    const success = await register({ name: formData.name, email: formData.email, password: formData.password });
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-background">
      <div className="fintech-card p-5" style={{ maxWidth: '450px', width: '100%' }}>
        <div className="text-center mb-4">
          <h2 className="text-gradient fw-bold mb-2">ExpenseIQ</h2>
          <p className="text-secondary">Create a new account</p>
        </div>

        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label text-secondary fw-500">Full Name</label>
            <input type="text" className="form-control p-2" name="name" value={formData.name} onChange={onChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label text-secondary fw-500">Email Address</label>
            <input type="email" className="form-control p-2" name="email" value={formData.email} onChange={onChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label text-secondary fw-500">Password</label>
            <input type="password" className="form-control p-2" name="password" value={formData.password} onChange={onChange} required minLength="6" />
          </div>
          <div className="mb-4">
            <label className="form-label text-secondary fw-500">Confirm Password</label>
            <input type="password" className="form-control p-2" name="confirmPassword" value={formData.confirmPassword} onChange={onChange} required />
          </div>
          <button type="submit" className="btn-primary-custom w-100 mb-3">Sign Up</button>
        </form>

        <p className="text-center text-secondary m-0">
          Already have an account? <Link to="/login" className="text-primary text-decoration-none fw-bold">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
