import type { Events, EventFunction } from './types';
/**
 * 异步事件模型
 */
export default class AsyncEvent {
    events: Events;
    constructor(events?: Events);
    /**
     * 绑定事件
     * @param event 事件名称
     * @param evtFn 回调函数
     * @returns {AsyncEvent} this
     */
    on(event: string, evtFn: EventFunction): this;
    /**
     * 解绑事件
     * @param event 事件名称
     * @param evtFn 回调函数
     * @returns {AsyncEvent} this
     */
    off(event: string, evtFn: EventFunction): this;
    /**
     * 分发事件
     * @param event 事件名称
     * @param args 参数
     * @returns {AsyncEvent} this
     */
    emit(event: string, ...args: any[]): this;
    /**
     * 异步分发事件
     * @param event 事件名称
     * @param args 参数
     * @returns {Promise<*[]>}
     */
    emitAsync(event: string, ...args: any[]): Promise<void[]>;
    /**
     * 绑定事件，仅执行一次
     * @param event 事件名称
     * @param evtFn 回调函数
     * @returns {AsyncEvent} this
     */
    once(event: string, evtFn: Function): this;
    /**
     * 绑定事件，优先执行
     * @param event 事件名称
     * @param evtFn 回调函数
     * @returns {AsyncEvent} this
     */
    before(event: string, evtFn: EventFunction): this;
    /**
     * 订阅事件
     * @param event 事件名称
     * @param evtFn 回调函数
     * @returns {function(): AsyncEvent} 解绑事件
     */
    subscribe(event: string, evtFn: EventFunction): () => this;
}
