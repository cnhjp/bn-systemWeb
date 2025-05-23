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

/**
 * 将字符串转换为 Blob 对象
 * @param input 需要转换的字符串
 * @param mimeType  MIME type
 * @returns Blob 对象
 */
function base64ToBlob(base64Str: string, mimeType: string = 'application/octet-stream'): Blob {
    // 如果字符串是以 PK 开头的 Base64 编码
    if (base64Str.startsWith('PK')) {
        // 将 Base64 字符串转换为 Uint8Array
        const binaryString = window.atob(base64Str)
        const len = binaryString.length
        const bytes = new Uint8Array(len)

        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i)
        }

        // 创建 Blob
        return new Blob([bytes], { type: mimeType })
    }

    // 如果不是以 PK 开头，可能是普通的 Base64 字符串
    const base64Response = base64Str.startsWith('data:') ? base64Str : `data:${mimeType};base64,${base64Str}`

    // 通过 fetch 转换
    const byteCharacters = window.atob(base64Response.split(',')[1])
    const byteNumbers = new Array(byteCharacters.length)

    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)
    return new Blob([byteArray], { type: mimeType })
}

/**
 * 下载 Blob 对象
 * @param blob 需要下载的 Blob 对象
 * @param name 文件名
 */
export function downloadBlob(blob: Blob, name: string) {
    if (blob instanceof Blob) {
        if ('navigator' in window && 'msSaveBlob' in window.navigator) {
            ;(window.navigator as any).msSaveBlob(blob, name)
        } else if ('download' in document.createElement('a')) {
            const link = document.createElement('a')
            link.download = name
            link.style.display = 'none'
            link.href = URL.createObjectURL(blob)
            document.body.appendChild(link)
            link.click()
            URL.revokeObjectURL(link.href)
            document.body.removeChild(link)
        }
    } else {
        downloadBlob(base64ToBlob(blob), name)
    }
}

/**
 * 判断字符串是否为 JSON 格式
 * @param jsonString
 * @returns
 */
export function isValidJSON(jsonString: string) {
    try {
        JSON.parse(jsonString)
        return true
    } catch (error) {
        return false
    }
}

/**
 * 下拉value转number ，添加全部选项
 * @param list
 * @returns
 */
export function dropDownSetValueNumner(list: any[], hasAll: boolean = false, isNumber: boolean = false) {
    if (list && list.length > 0) {
        if (isNumber) {
            list.map((item) => {
                item.value = item.value ? Number(item.value) : null
                return item
            })
        }
        if (hasAll) {
            list.unshift({ label: '全部', value: 0, selected: true })
        }
    }
    return list
}

/**
 * 下载文件
 * @param url
 * @param name
 */
export function downloadFile(url: string, name: string) {
    const x = new window.XMLHttpRequest()
    const filename = name || ''
    x.open('GET', `${url}?t=${new Date().getTime()}`, true)

    x.responseType = 'blob'
    x.onload = () => {
        const fileUrl = window.URL.createObjectURL(x.response)
        const a = document.createElement('a')
        a.download = filename
        a.href = fileUrl
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }
    x.send()
}

/**
 * 将对象转换成查询参数字符串
 * @param {Object} params 查询参数对象
 * @returns {string} 查询参数字符串
 * @example
 * const params = { a: 1, b: 2, c: [3, 4] }
 * const queryString = createQueryParams(params) // 'a=1&b=2&c=3&c=4'
 */
export function createQueryParams(params: Record<string, any>): string {
    const queryParts: string[] = []

    for (const key in params) {
        if (Object.prototype.hasOwnProperty.call(params, key)) {
            const value = params[key]

            if (Array.isArray(value)) {
                // 如果是数组，每个元素生成一个键值对
                value.forEach((item) => {
                    queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(item)}`)
                })
            } else {
                // 普通键值对
                queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            }
        }
    }

    // 使用 & 连接所有部分
    return queryParts.join('&')
}
