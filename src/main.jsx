import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(e) { return { error: e }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ fontFamily: 'system-ui', padding: 40, maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ color: '#C0392B' }}>Something went wrong</h2>
          <pre style={{ background: '#FEF0EE', padding: 16, borderRadius: 8, fontSize: 13, whiteSpace: 'pre-wrap', marginTop: 12 }}>
            {this.state.error?.message}
            {'\n\n'}
            {this.state.error?.stack}
          </pre>
          <button onClick={() => window.location.reload()} style={{ marginTop: 16, padding: '10px 20px', background: '#2E86AB', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
)
