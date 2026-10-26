import React from 'react';
import { CircleAlert } from 'lucide-react';
import { resetProgress } from '../lib/progress';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRestart = () => {
    resetProgress();
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-screen" role="alert">
          <div className="error-boundary-card">
            <div className="error-boundary-icon" aria-hidden="true">
              <CircleAlert size={48} />
            </div>
            <h1 className="error-boundary-title">The manor file has been disturbed</h1>
            <p className="error-boundary-message">
              An unexpected shadow fell across the case notes. You can clear the table and start fresh tonight.
            </p>
            <button
              type="button"
              className="primary"
              onClick={this.handleRestart}
            >
              Start over
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
