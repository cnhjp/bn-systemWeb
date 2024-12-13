import DownloadUtil from 'downloadjs';
export { DownloadUtil };
/**
 * 定义原型对象
 * @param target 目标对象
 * @param prop 属性名称
 * @param callback 回调函数
 */
export declare function definePrototype(target: Function, prop: string, callback: Function): void;
/**
 * 定义访问器
 * @param target 目标对象
 * @param prop 属性名称
 * @param getter 访问函数
 * @param setter 设置函数
 */
export declare function defineGetter<T>(target: T, prop: PropertyKey, getter: () => any, setter: (value: any) => void): void;
/**
 * 定义只读属性
 * @param target 目标独享
 * @param prop 属性名称
 * @param value 属性值
 */
export declare function defineReadOnly<T>(target: T, prop: PropertyKey, value: any): void;
/**
 * 防抖函数
 * @param callback 回调函数
 * @param delay 推迟时间（秒）
 * @param immediate 是否第一次触发后执行
 */
export declare function debounce(func: Function, wait: number, options: Record<string, any>): {
    (this: any, ...args: any): any;
    cancel(id: any): void;
    flush(): void;
    pending: boolean;
};
/**
 * 将计划串成职责链
 * @param plans 计划集合
 * @returns
 */
export declare function toPlanChains(this: any, plans: Array<Function>): Function;
/**
 * 数据克隆（深拷贝）
 * @param source 来源对象
 * @param target 目标对象
 * @returns {*} 拷贝结果
 */
export declare function clone(source: any, target?: any): any;
/**
 * 路径操作类
 */
export declare class Path {
    /**
     * 查询参数转参数对象
     * @param search 查询参数
     */
    static toObject(search: string): Object;
    /**
     * 参数对象转查询参数
     * @param object 参数对象
     */
    static toSearch(object: Record<string, any>): string;
    /**
     * 获取查询参数字符串
     * @param url 路径
     */
    static getString(url: string): string;
    /**
     * 获取路径参数对象
     * @param url 路径
     */
    static getSearch(url: string): Object;
    /**
     * 设置路径查询参数
     * @param url 路径
     * @param data 参数对象
     */
    static setSearch(url: string, data: Object): string;
    /**
     * 通过路径获取文件后缀名
     * @param url 路径
     */
    static getSuffix(url: string): string | null;
}
/**
 * 类型操作类
 */
export declare class Types {
    static Unknown: Symbol;
    static String: Symbol;
    static Number: Symbol;
    static Object: Symbol;
    static Array: Symbol;
    private static parse;
    /**
     * 是否对象类型
     * @param arg 参数
     */
    static isObject(arg: any): boolean;
    /**
     * 是否数组类型
     * @param arg 参数
     */
    static isArray(arg: any): boolean;
    /**
     * 是否数字类型
     * @param arg 参数
     */
    static isNumber(arg: any): boolean;
    /**
     * 是否字符串类型
     * @param arg 参数
     */
    static isString(arg: any): boolean;
}
