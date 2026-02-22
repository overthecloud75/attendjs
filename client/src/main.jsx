import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './lang/I18n'
import './index.css'
import App from './App'
import store from './storage/store.js'
import axios from 'axios'

axios.interceptors.response.use((response) => {
    if (response.headers.csrftoken) {
        axios.defaults.headers.common['X-CSRF-Token'] = response.headers.csrftoken
    }
    return response
}, (error) => Promise.reject(error))

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <App />
    </Provider>
)
