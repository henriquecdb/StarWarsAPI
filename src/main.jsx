import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import PeopleHtml from './PeopleHtml.jsx'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <PeopleHtml />
  </React.StrictMode>,
)
