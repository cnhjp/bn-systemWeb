import { AxiosRequestConfig, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

export interface HttpInterceptors {
    requestSucceedInterceptors?: (config: HttpRequestConfig) => HttpRequestConfig
    requestFailedInterceptors?: (error: HttpError) => any
    responseSucceedInterceptors?: (response: HttpResponse) => any
    responseFailedInterceptors?: (error: HttpError) => any
}

export interface HttpRequestConfig<D = any> extends AxiosRequestConfig<D>, Record<string, any> {
    interceptors?: HttpInterceptors
}

export interface HttpRequestConfig2 extends AxiosRequestConfig, Record<string, any> {
    interceptors?: HttpInterceptors
}

export interface InternalHttpRequestConfig<D> extends InternalAxiosRequestConfig<D>, Record<string, any> {
    interceptors?: HttpInterceptors
}

export interface HttpResponse<T = any, D = any> extends AxiosResponse<T, D> {
    config: InternalHttpRequestConfig<D>
}

export class HttpError<T = unknown, D = any> extends AxiosError<T, D> {
    declare config?: InternalHttpRequestConfig<D>

    name = 'HttpError'
}
