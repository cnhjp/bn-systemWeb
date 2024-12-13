import type { AxiosPromise, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
/**
 * 设置超时时间
 * @param timeout 超时时间（毫秒）
 */
export declare function setHttpTimeout(timeout: number): void;
/**
 * http库
 */
export default class HttpLibrary {
    instance: AxiosInstance;
    /**
     * 构造函数
     */
    constructor();
    /**
     * 拦截器
     */
    interceptors(): void;
    /**
     * 发起请求前调用
     * @param config 配置信息
     */
    onRequestBefore(config: AxiosRequestConfig): Promise<AxiosRequestConfig>;
    /**
     * 请求成功回调
     * @param config 配置信息
     */
    onRequestFulfilled(config: AxiosRequestConfig): Promise<AxiosRequestConfig>;
    /**
     * 请求失败回调
     * @param error 异常信息
     */
    onRequestRejected(error: any): Promise<any>;
    /**
     * 响应成功回调
     * @param response 响应信息
     */
    onResponseFulfilled(response: AxiosResponse): Promise<AxiosResponse>;
    /**
     * 响应失败回调
     * @param error 异常信息
     */
    onResponseRejected(error: any): Promise<any>;
    /**
     * 发起请求
     * @param config 配置信息
     */
    request<R>(config: AxiosRequestConfig): AxiosPromise<R>;
    /**
     * 发起 GET 请求
     * @param url 请求地址
     * @param data 请求参数
     * @param config 配置信息
     */
    get<T, R>(url: string, data?: T, config?: AxiosRequestConfig): AxiosPromise<R>;
    /**
     * 发起 POST 请求
     * @param url 请求地址
     * @param data 请求参数
     * @param config 配置信息
     */
    post<T, R>(url: string, data?: T, config?: AxiosRequestConfig): AxiosPromise<R>;
    /**
     * 发起 PUT 请求
     * @param url 请求地址
     * @param data 请求参数
     * @param config 配置信息
     */
    put<T, R>(url: string, data?: T, config?: AxiosRequestConfig): AxiosPromise<R>;
    /**
     * 发起 delete 请求
     * @param url 请求地址
     * @param data 请求参数
     * @param config 配置信息
     */
    delete<T, R>(url: string, data?: T, config?: AxiosRequestConfig): AxiosPromise<R>;
    /**
     * 发起 POST 请求
     * @param url 请求地址
     * @param data 请求参数
     * @param config 配置信息
     */
    form<T, R>(url: string, data?: T, config?: AxiosRequestConfig): AxiosPromise<R>;
    /**
     * 发起 POST 请求，响应数据类型为 Blob 类型，下载数据
     * @param url 请求地址
     * @param data 请求参数
     * @param config 配置信息
     */
    download<T>(url: string, data?: T, config?: AxiosRequestConfig): AxiosPromise<Blob>;
    /**
     * 请求及中断Promise调用链
     * @param message 中断信息
     */
    cancel(message: string): void;
}
