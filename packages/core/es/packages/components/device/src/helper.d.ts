import type { Regexes } from './types';
/**
 * 拓展合并
 * @param regexes
 * @param extensions
 */
export declare const extend: (regexes: Regexes, extensions: Regexes) => Regexes;
/**
 * 数组转换成枚举对象
 * @param arr
 */
export declare const toEnumeration: (arr: Array<string>) => Record<string, any>;
/**
 * 字符串内是否包含，忽略大小写
 * @param str1
 * @param str2
 */
export declare const has: (str1: string, str2: string) => boolean;
/**
 * 转换成小写字符串
 * @param str
 */
export declare const toLowerCase: (str: string) => string;
/**
 * 解析版本号，获取主版本
 * @param version
 */
export declare const toMajor: (version: string | undefined) => string;
/**
 * 去除空格
 * @param str
 * @param len
 */
export declare const trim: (str: string, len: number) => string;
/**
 * 正则表达式映射器
 * @param ua
 * @param arrays
 */
export declare const rgxMapper: (this: any, ua: string, arrays: any[]) => void;
/**
 * 字符串映射器
 * @param str
 * @param map
 */
export declare const strMapper: (str: string, map: Array<any>) => string | undefined;
