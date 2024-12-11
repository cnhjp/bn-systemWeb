import type { PiniaPluginContext } from 'pinia'

export function timestamp(context: PiniaPluginContext) {
    const { store } = context
    store.stimestamp = new Date().getTime()
}
