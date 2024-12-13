import AsyncEvent from './AsyncEvent';
import type { Events, EventFunction, Prop } from './types';
export default class Application extends AsyncEvent {
    private readonly opts;
    prop: Prop;
    isReady: Boolean;
    /**
     * 构造函数
     * @param mount 挂载对象
     */
    constructor(mount?: Events);
    /**
     * 启动应用
     * @param opts 配置信息
     */
    bootstrap(opts: Record<string, any>): Promise<any>;
    /**
     * 初始化应用
     * @param opts 配置信息
     */
    init(opts: Record<string, any>): Promise<any>;
    /**
     * 启动应用
     * 初始化成功后即可启动应用
     * @returns {Promise<void>}
     */
    start(): Promise<any>;
    /**
     * 准备应用
     * @param callback 回调函数
     */
    ready(callback: EventFunction): void;
    /**
     * 挂起应用
     * @param error 异常信息
     */
    halt(error: Error): void;
    private initProp;
}
