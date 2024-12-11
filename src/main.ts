import { createApp } from 'vue'
import App from './App.vue'
import 'virtual:uno.css'
import 'virtual:svg-icons-register'
// @ts-ignore
import { BGrid } from '@package/b-grid'
import '@package/b-grid/lib/style.css'
import './styles/theme-norm/index.scss'
import { setupStore } from './store'
import { setupRouter } from './router'
import { setupGlobalComponents } from './components'

async function setupApp() {
    const app = createApp(App)

    await setupStore(app)

    await setupRouter(app)

    setupGlobalComponents(app)
    app.use(BGrid)

    app.mount('#app')
}

setupApp()
