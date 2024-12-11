import VueCookies from 'vue-cookies'
import { encrypto, decrypto } from './crypto'

interface VueCookies extends Record<string, any> {
    /**
     * Set global config
     */
    config(expires: string | number | Date, path?: string, domain?: string, secure?: boolean, sameSite?: string): void

    /**
     * Set a cookie
     */
    set(
        keyName: string,
        value: any,
        expires?: string | number | Date,
        path?: string,
        domain?: string,
        secure?: boolean,
        sameSite?: string,
    ): this

    /**
     * Get a cookie
     */
    get(keyName: string): any

    /**
     * Remove a cookie
     */
    remove(keyName: string, path?: string, domain?: string): boolean

    /**
     * Exist a cookie name
     */
    isKey(keyName: string): boolean

    /**
     * Get All cookie name
     */
    keys(): string[]
}

type SameSite = 'Lax' | 'Strict' | 'None'

export interface StorageConfig {
    /** 过期时间 */
    expires: number | Date
    /** 访问cookie的页面的路径
     * （该属性只有在Cookie模式下有效）
     * */
    path?: string
    /** cookie域名
     * （该属性只有在Cookie模式下有效）
     * */
    domain?: string
    /** 定义cookie的安全性，
     * 当该值为true时必须是HTTPS状态下cookie才从客户端附加在HTTP消息中发送到服务端，在HTTP时cookie是不发送的，
     * Secure为false时则可在HTTP状态下传递cookie，Secure缺省为false。
     * （该属性只有在Cookie模式下有效）
     * */
    secure?: boolean
    /** 定义cookie安全策略
     * Lax：大多数情况也不发送第三方Cookie，但是导航到目标站点的Get请求、预加载（link标签）和链接（a标签）除外，
     * Strict：完全禁止第三方Cookie，当当前站点与请求目标站点是跨站关系时，总是不会发送Cookie。换言之，只有当前站点与请求目标站点是同站关系时，才会带上Cookie，
     * None：允许第三方Cookie，始终发送。站点选择显式关闭SameSite属性时，在将其值设为None的同时。必须同时设置Secure属性（表示Cookie只能通过HTTPS协议发送），否则无效，需要HTTPS协议。
     * （该属性只有在Cookie模式下有效）
     * */
    sameSite?: SameSite
}

export interface StorageData<T> {
    value: T
    expires: number
    timestamp: number
}

export interface StorageInterface {
    config: StorageConfig

    set: <T>(key: string, value: T) => void
    get: <T>(key: string) => T | null
    remove: (key: string) => void
    clear: () => void
}

const $cookies = VueCookies as any as VueCookies

function encryptStorage<T>(value: T, config: StorageConfig): string {
    const data: StorageData<T> = {
        value: value,
        expires: config.expires instanceof Date ? config.expires.getTime() : config.expires,
        timestamp: Date.now(),
    }
    return encrypto(data) || ''
}

function decryptStorage<T>(value: string | null, config: StorageConfig) {
    const data: StorageData<T> | null = decrypto(value)
    if (data) {
        const { expires } = config
        if (expires instanceof Date && expires.getTime() > Date.now()) {
            return data.value
        }
        if (typeof expires === 'number' && expires > 0 && Date.now() - data.timestamp < expires * 1000) {
            return data.value
        }
    }
    return null
}

export class CookieStore implements StorageInterface {
    config: StorageConfig

    constructor(config: StorageConfig) {
        this.config = config
    }

    set<T>(key: string, value: T) {
        $cookies.set(
            key,
            encryptStorage(value, this.config),
            this.config.expires,
            this.config.path,
            this.config.domain,
            this.config.secure,
            this.config.sameSite,
        )
    }

    get<T>(key: string) {
        let data: StorageData<T> | null = null
        try {
            data = decrypto($cookies.get(key))
        } catch (error: any) {
            // 防止解析失败
            console.log('🚀 ~ file: storage.ts ~ CookieStore ~ error:\n', error.message)
        }
        if (data) {
            return data.value
        }
        this.remove(key)
        return null
    }

    remove(key: string) {
        $cookies.remove(key)
    }

    clear() {
        $cookies.keys().forEach((key) => {
            $cookies.remove(key)
        })
    }
}

export class LocalStore implements StorageInterface {
    config: StorageConfig

    constructor(config: StorageConfig) {
        this.config = config
    }

    set<T>(key: string, value: T) {
        window.localStorage.setItem(key, encryptStorage(value, this.config))
    }

    get<T>(key: string) {
        let data: StorageData<T> | null = null
        try {
            data = decryptStorage(window.localStorage.getItem(key), this.config)
        } catch (error: any) {
            // 防止解析失败
            console.log('🚀 ~ file: storage.ts ~ CookieStore ~ error:\n', error.message)
        }

        if (data && data.value) {
            return data.value
        }
        this.remove(key)
        return null
    }

    remove(key: string) {
        window.localStorage.removeItem(key)
    }

    clear() {
        window.localStorage.clear()
    }
}

export class SessionStore implements StorageInterface {
    config: StorageConfig

    constructor(config: StorageConfig) {
        this.config = config
    }

    set<T>(key: string, value: T) {
        window.sessionStorage.setItem(key, encryptStorage(value, this.config))
    }

    get<T>(key: string) {
        let data: StorageData<T> | null = null
        try {
            data = decryptStorage(window.sessionStorage.getItem(key), this.config)
        } catch (error: any) {
            // 防止解析失败
            console.log('🚀 ~ file: storage.ts ~ SessionStore ~ error:\n', error.message)
        }

        if (data) {
            return data.value
        }
        this.remove(key)
        return null
    }

    remove(key: string) {
        window.sessionStorage.removeItem(key)
    }

    clear() {
        window.sessionStorage.clear()
    }
}

export function createStorage(mode: string, config?: StorageConfig): StorageInterface {
    if (mode === 'local') return new LocalStore({ expires: 0, ...config })
    if (mode === 'session') return new SessionStore({ expires: 0, ...config })
    if (mode === 'cookie') return new CookieStore({ expires: 60 * 60 * 24 * 7, ...config })
    return new LocalStore({ expires: 0, ...config })
}
