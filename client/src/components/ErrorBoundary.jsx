import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[React ErrorBoundary] Error:', error.message || error);
    console.error('[React ErrorBoundary] Component stack:', info?.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f4f1ea',
          fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
          padding: '24px',
        }}>
          <div style={{
            background: '#fffdf7',
            border: '1px solid #ded7cb',
            borderRadius: '16px',
            padding: '40px',
            maxWidth: '480px',
            textAlign: 'center',
            boxShadow: '0 4px 24px rgba(40,34,23,.08)',
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#fff2d9',
              border: '2px solid #ebcd8e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <AlertTriangle size={28} color="#b8860b" />
            </div>
            <h2 style={{
              fontSize: '1.4rem',
              fontWeight: 900,
              color: '#17201d',
              marginBottom: '12px',
            }}>
              Something went wrong
            </h2>
            <p style={{
              fontSize: '0.95rem',
              color: '#53615c',
              marginBottom: '24px',
              lineHeight: 1.6,
            }}>
              The app encountered an error. Your progress is safe — refresh to continue.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={this.handleRetry}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  background: '#d8f07c',
                  color: '#17231f',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                }}
              >
                <RefreshCw size={16} /> Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  background: 'transparent',
                  color: '#17201d',
                  border: '2px solid #d4cdc0',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                }}
              >
                Refresh Page
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={{
                marginTop: '24px',
                textAlign: 'left',
                background: '#fde8e8',
                border: '1px solid #f5c6c6',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '0.8rem',
                fontFamily: 'ui-monospace, monospace',
                color: '#7a1010',
              }}>
                <summary style={{ cursor: 'pointer', fontWeight: 700, marginBottom: '8px' }}>
                  Error Details
                </summary>
                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>
                  {this.state.error?.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}