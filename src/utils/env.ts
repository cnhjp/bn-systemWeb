function _tryParse(value: string): string | number | boolean {
    try {
        value = value ? value.trim() : ''
        if (value.toLowerCase() === 'true') return true
        if (value.toLowerCase() === 'false') return false
        if (/^\d+$/gim.test(value)) return Number(value)
        return value
    } catch (error) {
        return value
    }
}

export function wrapperEnv(envConf: Recordable = import.meta.env): ImportMetaEnv {
    const viteEnv: any = {}
    Object.keys(envConf).forEach((name) => {
        viteEnv[name] = _tryParse(envConf[name])
    })
    return viteEnv as ImportMetaEnv
}
