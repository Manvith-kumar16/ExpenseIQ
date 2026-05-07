import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-background text-center p-4">
      <h1 className="display-1 fw-bold text-primary mb-2">404</h1>
      <h2 className="fw-bold mb-3">Page Not Found</h2>
      <p className="text-secondary mb-4">The page you are looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn-primary-custom text-decoration-none">Return to Dashboard</Link>
    </div>
  );
};

export default NotFound;
