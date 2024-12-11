import { createApp } from 'vue'
import App from './App.vue'
import 'virtual:uno.css'
import 'virtual:svg-icons-register'
import './styles/theme-norm/index.scss'

import { setupStore } from './store'
import { setupRouter } from './router'
import { setupGlobalComponents } from './components'

async function setupApp() {
    const app = createApp(App)

    await setupStore(app)

    await setupRouter(app)

    await setupGlobalComponents(app)

    app.mount('#app')
}

setupApp()
