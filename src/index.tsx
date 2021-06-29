import React from 'react'
import ReactDOM from 'react-dom'
import App from './client/App'

const rootElement = document.getElementById("app");

ReactDOM.hydrate(<App />, rootElement);
