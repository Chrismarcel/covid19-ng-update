import React from 'react'
import ReactDOM from 'react-dom'
import Dashboard from './components/Dashboard';

const App = () => (
  <Dashboard />
)

const rootElement = document.getElementById("app");
ReactDOM.render(<App />, rootElement);
