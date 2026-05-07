import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import FormInput from '../components/FormInput';
import { FaWallet } from 'react-icons/fa';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setIsSubmitting(true);
    const success = await register({ name: formData.name, email: formData.email, password: formData.password });
    setIsSubmitting(false);
    
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="auth-layout">
      {/* Brand Section - Left Side */}
      <div className="auth-brand-section">
        <div className="mb-4">
          <FaWallet size={64} className="text-white opacity-75" />
        </div>
        <h1 className="fw-bold mb-3 display-4">ExpenseIQ</h1>
        <p className="lead opacity-75 text-center" style={{ maxWidth: '400px' }}>
          Join thousands of smart users. Start your journey toward better financial health today.
        </p>
      </div>

      {/* Form Section - Right Side */}
      <div className="auth-form-section">
        <div className="auth-card">
          <div className="text-center mb-4">
            <h3 className="fw-bold text-primary mb-2">Create Account</h3>
            <p className="text-secondary">Sign up for free</p>
          </div>

          <form onSubmit={onSubmit}>
            <FormInput
              label="Full Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={onChange}
              required={true}
            />

            <FormInput
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              required={true}
            />

            <FormInput
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={onChange}
              required={true}
              minLength="6"
            />

            <FormInput
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={onChange}
              required={true}
              minLength="6"
            />

            <button 
              type="submit" 
              className="btn-primary-custom w-100 mt-4 mb-3 d-flex align-items-center justify-content-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Signing Up...
                </>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          <p className="text-center text-secondary mt-3 mb-0">
            Already have an account? <Link to="/login" className="text-primary text-decoration-none fw-bold">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
