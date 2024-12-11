import { TypeAssert } from './types'

export const applyDefaults = <T>(source: Recordable, defaults: Recordable) => {
    const keys = new Set([...Object.keys(source), ...Object.keys(defaults)])
    keys.forEach((key) => {
        const value = source[key] === undefined || source[key] === null ? defaults[key] : source[key]
        if (TypeAssert.isObject(value)) {
            source[key] = applyDefaults(source[key] || {}, defaults[key] || {})
        } else {
            source[key] = value
        }
    })
    return source as T
}

export function exeStrategyActions(actions: Common.StrategyAction[]) {
    actions.some((item) => {
        const [flag, action] = item
        const result = flag()
        if (result) {
            action()
        }
        return result
    })
}
