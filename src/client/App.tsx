import React from 'react'
import Dashboard from './components/Dashboard'
import ErrorBoundary from './components/ErrorBoundary'

const App = () => (
  <ErrorBoundary>
    <Dashboard />
  </ErrorBoundary>
)

export default App
