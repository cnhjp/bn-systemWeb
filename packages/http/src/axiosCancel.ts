import Axios, { Canceler } from 'axios'
import qs from 'qs'
import { HttpRequestConfig } from './typescripts'

// 声明一个 Map 用于存储每个请求的标识 和 取消函数
let pendingMap = new Map<string, Canceler>()

// 序列化参数生成标识
export const getPendingUrl = (config: HttpRequestConfig) => {
    let data = qs.stringify(config.data)
    if (config.data instanceof FormData) {
        data = config.data
            .values()
            .toArray()
            .map((e) => (e instanceof File ? e.name : e))
            .join(',')
    }
    const r = [config.method, config.url, data, qs.stringify(config.params)].filter((e) => e).join('|')
    return r
}

export class AxiosCanceler {
    /**
     * @description: 添加请求
     * @param {Object} config
     * @return void
     */
    addPending(config: HttpRequestConfig): void {
        this.removePending(config)
        const url = getPendingUrl(config)
        config.cancelToken =
            config.cancelToken ||
            new Axios.CancelToken((cancel) => {
                if (!pendingMap.has(url)) {
                    pendingMap.set(url, cancel)
                }
            })
    }

    /**
     * @description: 移除请求
     * @param {Object} config
     * @return void
     */
    removePending(config: HttpRequestConfig): void {
        const url = getPendingUrl(config)
        if (pendingMap.has(url)) {
            const cancel = pendingMap.get(url)
            cancel && cancel(url)
            pendingMap.delete(url)
        }
    }

    /**
     * @description: 清空所有pending
     * @return void
     */
    removeAllPending(): void {
        pendingMap.forEach((cancel: Canceler) => {
            cancel && cancel instanceof Function && cancel()
        })
        pendingMap.clear()
    }

    /**
     * @description：移除关联的pending
     * @return void
     */
    removeRelevancePending(method: string, url: string, data: object, params: object): void {
        const pendingUrl = [method, url, qs.stringify(data), qs.stringify(params)].join('|')
        const filters = Array.from(pendingMap.keys()).filter((e) => e.indexOf(pendingUrl) > -1)
        filters.forEach((key) => {
            const cancel = pendingMap.get(key)
            cancel && cancel()
            pendingMap.delete(key)
        })
    }

    /**
     * @description: 重置
     * @return void
     */
    reset(): void {
        pendingMap = new Map<string, Canceler>()
    }
}
