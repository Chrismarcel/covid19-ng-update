import React from 'react'
import ReactDOM from 'react-dom'
import MapChart from './MapChart';

const App = () => (
  <MapChart />
)

const rootElement = document.getElementById("app");
ReactDOM.render(<App />, rootElement);
