import { type App } from 'vue'
import commonDialog from './common-dialog'
import upload from './upload/src/upload.vue'

export function registerGlobalComponents(app: App) {
    app.component('b-common-dialog', commonDialog)
    app.component('b-upload', upload)
}
