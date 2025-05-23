import { createApp } from 'vue'
import App from './App.vue'
import 'virtual:uno.css'
import 'virtual:svg-icons-register'
import { BGrid } from '@package/b-grid'
import '@package/b-grid/lib/style.css'
import './styles/theme-norm/index.scss'
import { setupStore } from './store'
import { setupRouter } from './router'
import { setupGlobalComponents } from './components'
import { comApp } from './utils/application'
import 'element-plus/dist/index.css'

comApp.ready(async function setupApp() {
    const app = createApp(App)

    await setupStore(app)
    await setupRouter(app)
    setupGlobalComponents(app)
    app.use(BGrid)
    app.mount('#app')

    app.config.globalProperties.$app = window.$app = comApp
})

comApp.bootstrap()
