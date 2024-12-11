import type { PiniaPluginContext } from 'pinia'

export function debugging(context: PiniaPluginContext) {
    let key = context.store.$id
    key = key.replace(/store/gim, '').replace(/-/, '')
    ;(window.$store || (window.$store = {}))[key] = context.store
}
