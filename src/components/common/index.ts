import { type App } from 'vue'
import commonDialog from './common-dialog'
import upload from './upload'
import select from './select'

export function registerGlobalComponents(app: App) {
    app.component('b-common-dialog', commonDialog)
    app.component('b-upload', upload)
    app.component('b-select', select)
}
