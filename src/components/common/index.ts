import { type App } from 'vue'
import CommonDialog from './common-dialog'

export function registerGlobalComponents(app: App) {
    app.component('b-common-dialog', CommonDialog)
}
