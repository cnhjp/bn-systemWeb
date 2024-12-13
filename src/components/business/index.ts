import { type App } from 'vue'
import pageHeader from './page-header'

export function registerGlobalBusiness(app: App) {
    app.component('page-header', pageHeader)
}
