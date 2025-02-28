import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './lang/I18n'
import './index.css'
import App from './App'
import store from './storage/store.js'

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <App />
    </Provider>
)
