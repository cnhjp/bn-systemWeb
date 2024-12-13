/**
 * 是否空数组（数组为null或者数组长度等于0）
 * @param arr 数组对象
 */
export declare function isEmpty(arr: any): boolean;
/**
 * 是否非空数组（数组不为空并且数组长度大于0）
 * @param arr 数组对象
 */
export declare function isNotEmpty(arr: any): boolean;
/**
 * 数组去重
 * @param arr 数组对象
 * @param field 属性字段
 */
export declare function unique<T>(arr: Array<T>, field: string): void;
/**
 * 删除元素
 * @param arr 数组
 * @param selector 选择器
 */
export declare function remove<T>(arr: Array<T>, selector: ((value: T, index: number, array: T[]) => boolean) | T): number;
declare const _default: any;
export default _default;
