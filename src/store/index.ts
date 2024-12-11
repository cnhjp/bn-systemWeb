import type { App } from 'vue'
import { createPinia } from 'pinia'
import { debugging, timestamp } from './plugins'

/**
 * 安装vue状态管理插件：pinia
 * @param app Vue应用对象
 */
export function setupStore(app: App) {
    const pinia = createPinia()

    pinia.use(debugging)
    pinia.use(timestamp)

    app.use(pinia)
}

export * from './modules'
