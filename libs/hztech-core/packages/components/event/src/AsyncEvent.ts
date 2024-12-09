import type {Events, EventFunction} from './types'

/**
 * 异步事件模型
 */
export default class AsyncEvent {
    events: Events

    constructor(events?: Events) {
        this.events = events ? events : {}
    }

    /**
     * 绑定事件
     * @param event 事件名称
     * @param evtFn 回调函数
     * @returns {AsyncEvent} this
     */
    on(event: string, evtFn: EventFunction) {
        (this.events[event] || (this.events[event] = [])).push(evtFn)
        return this
    }

    /**
     * 解绑事件
     * @param event 事件名称
     * @param evtFn 回调函数
     * @returns {AsyncEvent} this
     */
    off(event: string, evtFn: EventFunction) {
        const events = this.events
        if (events[event]) {
            if (evtFn) {
                const fns = events[event]
                const pos = fns.indexOf(evtFn)
                if (pos > -1) {
                    fns.splice(pos, 1)
                }
            } else {
                delete events[event]
            }
        }
        return this
    }

    /**
     * 分发事件
     * @param event 事件名称
     * @param args 参数
     * @returns {AsyncEvent} this
     */
    emit(event: string, ...args: any[]) {
        const events = this.events
        if (events[event]) {
            const evtFns = events[event].slice()
            let evtFn
            while (evtFn = evtFns.shift()) {
                evtFn(...args)
            }
        }
        return this
    }

    /**
     * 异步分发事件
     * @param event 事件名称
     * @param args 参数
     * @returns {Promise<*[]>}
     */
    async emitAsync(event: string, ...args: any[]) {
        const events = this.events
        const result = []
        if (events[event]) {
            const evtFns = events[event].slice()
            let evtFn
            while (evtFn = evtFns.shift()) {
                result.push(await evtFn(...args))
            }
        }
        return result
    }

    /**
     * 绑定事件，仅执行一次
     * @param event 事件名称
     * @param evtFn 回调函数
     * @returns {AsyncEvent} this
     */
    once(event: string, evtFn: Function) {
        const once = (...args: any[]) => {
            this.off(event, once)
            evtFn(...args)
        }
        this.on(event, once)
        return this
    }

    /**
     * 绑定事件，优先执行
     * @param event 事件名称
     * @param evtFn 回调函数
     * @returns {AsyncEvent} this
     */
    before(event: string, evtFn: EventFunction) {
        (this.events[event] || (this.events[event] = [])).unshift(evtFn)
        return this
    }

    /**
     * 订阅事件
     * @param event 事件名称
     * @param evtFn 回调函数
     * @returns {function(): AsyncEvent} 解绑事件
     */
    subscribe(event: string, evtFn: EventFunction) {
        this.on(event, evtFn)
        return () => this.off(event, evtFn)
    }
}
