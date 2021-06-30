import React from 'react'
import ReactDOM from 'react-dom'
import App from './client/App'

const rootElement = window.document.getElementById('app')

ReactDOM.hydrate(<App />, rootElement)
