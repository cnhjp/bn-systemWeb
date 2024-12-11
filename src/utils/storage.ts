import { encrypto, decrypto } from './crypto'
import VueCookies from 'vue-cookies'

type SameSite = 'Lax' | 'Strict' | 'None'

export interface StorageConfig {
    /** 过期时间 */
    expires: number
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

abstract class AbstractStorage {
    config: StorageConfig

    constructor(config: StorageConfig) {
        this.config = config
    }
    abstract setItem<T>(key: string, value: T): void
    abstract getItem<T>(key: string): T | null
    abstract removeItem(key: string): void
    abstract clear(): void
}

function encryptStorage<T>(value: T, config: StorageConfig) {
    const data: StorageData<T> = {
        value: value,
        expires: config.expires || 0,
        timestamp: Date.now(),
    }
    return encrypto(data)
}
function decryptStorage<T>(value: string): StorageData<T> | null {
    return decrypto(value)
}

export class LocalStore extends AbstractStorage {
    setItem<T>(key: string, value: T): void {
        const encryptValue = encryptStorage(value, this.config)
        localStorage.setItem(key, encryptValue)
    }
    getItem<T>(key: string): T | null {
        const storageValue = localStorage.getItem(key)
        if (storageValue) {
            const decryptValue = decryptStorage<T>(storageValue)
            if (decryptValue) {
                const { value, expires, timestamp } = decryptValue
                if (expires === 0 || (expires > 0 && expires * 1000 > Date.now() - timestamp)) {
                    return value
                }
            }
            this.removeItem(key)
        }
        return null
    }
    removeItem(key: string): void {
        localStorage.removeItem(key)
    }
    clear(): void {
        localStorage.clear()
    }
}
