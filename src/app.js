import React from 'react'
import ReactDOM from 'react-dom'
import MapChart from './styles/components/MapChart';
import Dashboard from './styles/components/Dashboard';

const App = () => (
  <Dashboard />
)

const rootElement = document.getElementById("app");
ReactDOM.render(<App />, rootElement);
