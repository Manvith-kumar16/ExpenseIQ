import { Component } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light text-center px-3">
          <FaExclamationTriangle size={80} className="text-danger mb-4" />
          <h1 className="fw-bold mb-3">Oops! Something went wrong.</h1>
          <p className="text-secondary mb-4" style={{ maxWidth: '500px' }}>
            We're sorry, but an unexpected error occurred. Please try refreshing the page or contact support if the issue persists.
          </p>
          <button 
            className="btn btn-primary-custom px-4 py-2"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
