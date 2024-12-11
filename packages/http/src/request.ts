import Axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios'
import { AxiosCanceler } from './axiosCancel'
import { checkStatus } from './checkStatus'
import { HttpRequestConfig, HttpError, HttpResponse } from './typescripts'

const axiosCanceler = new AxiosCanceler()

function convertToFormData(data: any) {
    if (data instanceof FormData) return data

    function buildFormData(formData: FormData, value: any, key?: string) {
        if (Object.prototype.toString.call(value) === '[object Array]') {
            value.forEach((e: any, i: number) => {
                buildFormData(formData, e, `${key}[${i}]`)
            })
        } else if (Object.prototype.toString.call(value) === '[object Object]') {
            Object.keys(value).forEach((e: any) => {
                key = key ? `${key}.${e}` : e
                buildFormData(formData, value[e], key)
            })
        } else if (key) {
            formData.append(key, value)
        }
        return formData
    }

    return buildFormData(new FormData(), data)
}

export class HttpRequest<Config extends HttpRequestConfig = HttpRequestConfig> {
    instance: AxiosInstance

    constructor(config: Config) {
        this.instance = Axios.create(config)
        this.instance.interceptors.request.use(
            (config: HttpRequestConfig): any => {
                axiosCanceler.addPending(config)
                if (config.interceptors?.requestSucceedInterceptors) {
                    return config.interceptors.requestSucceedInterceptors(config)
                }
                return this.requestSucceed(config)
            },
            (error: HttpError) => {
                const { config } = error
                if (config && config.interceptors?.requestFailedInterceptors) {
                    return config.interceptors.requestFailedInterceptors(error)
                }
                return this.requestFailed(error)
            },
        )
        this.instance.interceptors.response.use(
            (response: HttpResponse): any => {
                const { config } = response
                axiosCanceler.removePending(config)
                if (config.interceptors?.responseSucceedInterceptors) {
                    return config.interceptors.responseSucceedInterceptors(response)
                }
                return this.responseSucceed(response)
            },
            (error: HttpError) => {
                const { response, config } = error
                // 请求超时单独判断，因为请求超时没有 response
                if (error.message.indexOf('timeout') > -1) {
                    error.message = '响应超时'
                }
                // 根据响应的错误状态码，做不同的处理
                if (response) {
                    error.status = response.status
                    error.message = checkStatus(response.status)
                }
                // 服务器结果都没有返回(可能服务器错误可能客户端断网)，断网处理:可以跳转到断网页面
                if (!window.navigator.onLine) {
                    error.message = '网络断开'
                }

                if (config && config.interceptors?.responseFailedInterceptors) {
                    return config.interceptors.responseFailedInterceptors(error)
                }

                if (error.code === 'ERR_CANCELED') {
                    console.log(`请求被取消：${error.message}`)
                    return new Promise(() => {})
                }

                return this.responseFailed(error)
            },
        )
    }

    protected requestSucceed(config: HttpRequestConfig) {
        return config
    }

    protected requestFailed(error: AxiosError) {
        return Promise.reject(error)
    }

    protected responseSucceed(response: AxiosResponse): any {
        return response
    }

    protected responseFailed(error: AxiosError) {
        return Promise.reject(error)
    }

    cancelRequest(method: string, url: string, data: object, params: object) {
        axiosCanceler.removeRelevancePending(method, url, data, params)
    }

    cancelAllRequest() {
        axiosCanceler.removeAllPending()
    }

    get<T = any, R = HttpResponse<any>>(url: string, params?: T, _object?: Config): Promise<R> {
        return this.instance.get(url, { params, ...(_object || {}) })
    }

    post<T = any, R = HttpResponse<any>>(url: string, params?: T, _object?: Config): Promise<R> {
        return this.instance.post(url, params, _object || {})
    }

    put<T = any, R = HttpResponse<any>>(url: string, params?: T, _object?: Config): Promise<R> {
        return this.instance.put(url, params, _object || {})
    }

    delete<T = any, R = HttpResponse<any>>(url: string, params?: T, _object?: Config): Promise<R> {
        return this.instance.delete(url, { params, ...(_object || {}) })
    }

    form<T = any, R = HttpResponse<any>>(url: string, params?: T, _object?: Config): Promise<R> {
        return this.instance.post(url, convertToFormData(params), {
            ...(_object || {}),
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
    }
}

export { AxiosError as HttpException }
