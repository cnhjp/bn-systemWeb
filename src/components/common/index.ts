import { type App } from 'vue'
import commonDialog from './common-dialog'
import upload from './upload'
import select from './select'
import editor from './editor'

export function registerGlobalComponents(app: App) {
    app.component('b-common-dialog', commonDialog)
    app.component('b-upload', upload)
    app.component('b-select', select)
    app.component('b-editor', editor)
}
