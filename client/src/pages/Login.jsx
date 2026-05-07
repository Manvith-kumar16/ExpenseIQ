import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import FormInput from '../components/FormInput';
import { FaChartLine } from 'react-icons/fa';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await login(formData);
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
          <FaChartLine size={64} className="text-white opacity-75" />
        </div>
        <h1 className="fw-bold mb-3 display-4">ExpenseIQ</h1>
        <p className="lead opacity-75 text-center" style={{ maxWidth: '400px' }}>
          Take control of your finances. Track, analyze, and manage your expenses with our premium tools.
        </p>
      </div>

      {/* Form Section - Right Side */}
      <div className="auth-form-section">
        <div className="auth-card">
          <div className="text-center mb-5">
            <h3 className="fw-bold text-primary mb-2">Welcome Back</h3>
            <p className="text-secondary">Sign in to your account</p>
          </div>

          <form onSubmit={onSubmit}>
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
            />

            <button 
              type="submit" 
              className="btn-primary-custom w-100 mt-4 mb-3 d-flex align-items-center justify-content-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="text-center text-secondary mt-4 mb-0">
            Don't have an account? <Link to="/register" className="text-primary text-decoration-none fw-bold">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
