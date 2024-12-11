import { App } from 'vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { registerGlobalComponents } from './common/index'

export function setupGlobalComponents(app: App) {
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
        app.component(key, component)
    }
    registerGlobalComponents(app)
}
