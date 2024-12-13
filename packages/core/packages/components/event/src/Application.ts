import AsyncEvent from './AsyncEvent'
import type {Events, EventFunction, Prop} from './types'

export default class Application extends AsyncEvent {
    private readonly opts: Record<string, any>

    public prop: Prop
    public isReady: Boolean

    /**
     * 构造函数
     * @param mount 挂载对象
     */
    constructor(mount?: Events) {
        super(mount)
        this.isReady = false
        this.opts = {}
        this.prop = this.initProp(this)
        this.prop('prop', this.prop)
    }

    /**
     * 启动应用
     * @param opts 配置信息
     */
    async bootstrap(opts: Record<string, any>): Promise<any> {
        return this.init(opts).then(this.start.bind(this)).catch(this.halt.bind(this))
    }

    /**
     * 初始化应用
     * @param opts 配置信息
     */
    async init(opts: Record<string, any>): Promise<any> {
        Object.assign(this.opts, opts)
    }

    /**
     * 启动应用
     * 初始化成功后即可启动应用
     * @returns {Promise<void>}
     */
    async start(): Promise<any> {
        this.isReady = true
        await this.emitAsync('ready', this)
    }

    /**
     * 准备应用
     * @param callback 回调函数
     */
    ready(callback: EventFunction): void {
        if (this.isReady) {
            callback(this, (fn: Function) => fn(this))
        }
        this.on('ready', callback)
    }

    /**
     * 挂起应用
     * @param error 异常信息
     */
    halt(error: Error): void {
    }

    private initProp<T>(target: T): Prop {
        return (key: string, value: any, opts: PropertyDescriptor = {}): void => {
            opts.value = value
            opts.writable = false //不可编辑
            opts.enumerable = false //不可枚举
            opts.configurable = false //不可配置
            Object.defineProperty(target, key, opts)
        }
    }
}
