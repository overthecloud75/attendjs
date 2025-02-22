//import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
//import reportWebVitals from './reportWebVitals'
import { Provider } from 'react-redux'
import store from './storage/store'

createRoot(document.getElementById('root')).render(
    // <React.StrictMode>
    <Provider store={store}>
        <App />
    </Provider>
    // </React.StrictMode>
)

//reportWebVitals()
