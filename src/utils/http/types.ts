import type { InternalHttpRequestConfig, HttpResponse } from '@package/http'

/** 请求配置 */
export interface BusinessConfig<D = any> extends InternalHttpRequestConfig<D> {
    download?: boolean
    throwError?: boolean
    toastError?: boolean
}

/** 业务请求 */
export interface BusinessResponse<T = any, D = any> extends HttpResponse<T, D> {
    config: BusinessConfig
}
