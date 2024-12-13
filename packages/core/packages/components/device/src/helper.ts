import {
    STR_TYPE,
    EMPTY,
    UNDEF_TYPE,
    UA_MAX_LENGTH,
    OBJ_TYPE,
    FUNC_TYPE,
    UNKNOWN
} from './constants'
import type {Regexes} from './types'

/**
 * 拓展合并
 * @param regexes
 * @param extensions
 */
export const extend = function (regexes: Regexes, extensions: Regexes): Regexes {
    const mergedRegexes: Regexes = {
        browser: [],
        cpu: [],
        device: [],
        engine: [],
        os: []
    }
    for (const i in regexes) {
        if (extensions[i] && extensions[i].length % 2 === 0) {
            mergedRegexes[i] = extensions[i].concat(regexes[i])
        } else {
            mergedRegexes[i] = regexes[i]
        }
    }
    return mergedRegexes
}

/**
 * 数组转换成枚举对象
 * @param arr
 */
export const toEnumeration = function (arr: Array<string>) {
    const enums: Record<string, any> = {}
    for (let i = 0; i < arr.length; i++) {
        enums[arr[i].toUpperCase()] = arr[i]
    }
    return enums
}

/**
 * 字符串内是否包含，忽略大小写
 * @param str1
 * @param str2
 */
export const has = function (str1: string, str2: string) {
    return toLowerCase(str2).indexOf(toLowerCase(str1)) !== -1
}

/**
 * 转换成小写字符串
 * @param str
 */
export const toLowerCase = function (str: string) {
    return (str || '').toLowerCase()
}

/**
 * 解析版本号，获取主版本
 * @param version
 */
export const toMajor = function (version: string | undefined) {
    return (version || '').replace(/[^\d\.]/g, EMPTY).split('.')[0]
}

/**
 * 去除空格
 * @param str
 * @param len
 */
export const trim = function (str: string, len: number) {
    if (typeof str === STR_TYPE) {
        str = str.replace(/^\s\s*/, EMPTY).replace(/\s\s*$/, EMPTY)
        return typeof len === UNDEF_TYPE ? str : str.substring(0, UA_MAX_LENGTH)
    }
    return ''
}

/**
 * 正则表达式映射器
 * @param ua
 * @param arrays
 */
export const rgxMapper = function (this: any, ua: string, arrays: any[]) {
    let i = 0, j, k, p, q, matches, match

    // 循环遍历所有正则表达式映射
    while (i < arrays.length && !matches) {
        const regex = arrays[i], // even sequence (0,2,4,..)
            props = arrays[i + 1] // odd sequence (1,3,5,..)
        j = k = 0

        // 尝试用正则表达式匹配UA字符串
        while (j < regex.length && !matches) {
            matches = regex[j++].exec(ua)

            if (!!matches) {
                for (p = 0; p < props.length; p++) {
                    match = matches[++k]
                    q = props[p]
                    // 检查给定的属性是否实际上是数组
                    if (typeof q === OBJ_TYPE && q.length > 0) {
                        if (q.length === 2) {
                            if (typeof q[1] == FUNC_TYPE) {
                                // 分配修改匹配
                                this[q[0]] = q[1].call(this, match)
                            } else {
                                // 赋值，忽略正则匹配
                                this[q[0]] = q[1]
                            }
                        } else if (q.length === 3) {
                            // 检查function或regex
                            if (typeof q[1] === FUNC_TYPE && !(q[1].exec && q[1].test)) {
                                // 调用函数 (通用字符串映射器)
                                this[q[0]] = match
                                    ? q[1].call(this, match, q[2])
                                    : undefined
                            } else {
                                // 使用给定的正则表达式清除匹配
                                this[q[0]] = match ? match.replace(q[1], q[2]) : undefined
                            }
                        } else if (q.length === 4) {
                            this[q[0]] = match
                                ? q[3].call(this, match.replace(q[1], q[2]))
                                : undefined
                        }
                    } else {
                        this[q] = match ? match : undefined
                    }
                }
            }
        }
        i += 2
    }
}

/**
 * 字符串映射器
 * @param str
 * @param map
 */
export const strMapper = function (str: string, map: Array<any>) {
    for (const i in map) {
        // check if current value is array
        if (typeof map[i] === OBJ_TYPE && map[i].length > 0) {
            for (let j = 0; j < map[i].length; j++) {
                if (has(map[i][j], str)) {
                    return i === UNKNOWN ? undefined : i
                }
            }
        } else if (has(map[i], str)) {
            return i === UNKNOWN ? undefined : i
        }
    }
    return str
}
