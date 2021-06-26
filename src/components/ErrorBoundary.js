import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // TODO: Handle logging error using either New Relic or Sentry
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-wrapper">
          <div className="panel error-panel">
            <p>Oops!!! Ran into some problems while loading app. 🤖</p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
