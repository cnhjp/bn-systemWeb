import { HttpRequest, HttpError, type HttpResponse, type HttpRequestConfig } from '@package/http'
import type { AxiosResponse } from 'axios'
import { HttpStatus, HttpStatusDescription } from './enums'
import { useUserStore } from '@/store'
import { downloadBlob, isValidJSON } from '../common'
import { HttpEvent } from '../event'

/**
 * 当响应类型为二进制流（Blob）时，下载数据
 * @param response
 * @returns {Promise<unknown>}
 */
export function responseBlob(response: AxiosResponse): Promise<AxiosResponse> {
    return new Promise((resolve, reject) => {
        const content = response.data
        const headers = response.headers

        if (content instanceof Blob && content.type === 'application/octet-stream') {
            const blob = content
            const name =
                (response.config as any).downloadName ||
                decodeURIComponent(headers['content-disposition'].split(';')[1].split('filename=')[1])
            downloadBlob(blob, name)
            resolve(response)
        } else if ('FileReader' in window) {
            const fileReader = new FileReader()
            fileReader.onload = function () {
                if (isValidJSON(this.result as string)) {
                    response.data = JSON.parse(this.result as string)
                    resolve(response)
                } else {
                    const blob = new Blob([content], { type: content.type })
                    downloadBlob(blob, (response.config as any).downloadName)
                    resolve(response)
                }
            }
            fileReader.onerror = function (error) {
                reject(error)
            }
            fileReader.readAsText(content as Blob)
        } else {
            const error = new Error('Download tool not found') as Error & {
                status?: number
                response?: AxiosResponse
            }
            error.status = 404
            error.response = response
            reject(error)
        }
    })
}

function requestSucceed(config: HttpRequestConfig) {
    const userStore = useUserStore()

    if (!config.headers) config.headers = {}
    config.headers['authorization'] = userStore.token
    return config
}

function responseSucceed(response: HttpResponse) {
    const { data, config, request } = response

    const result = {
        code: data?.code || 0,
        data: data?.data,
        desc: data?.desc,
    }

    if (result.code === HttpStatus.SUCCESS) {
        // if (result.code === 200) {
        if (response.config.responseType === 'blob') {
            if ((response.config as any).download === true) {
                return responseBlob(response as any).catch(responseFailed as any)
            }
        }
        // }
        return result
    }

    ///// special handle
    if (response.config.responseType === 'blob') {
        if ((response.config as any).download === true) {
            return responseBlob(response as any).catch(responseFailed as any)
        }
    }

    const status: HttpStatus = result.code || HttpStatus.SYSTEM_ERROR
    const message: string = result.desc || HttpStatusDescription[status]
    const error = new HttpError(message, HttpStatus[status])
    error.status = status
    error.config = config
    error.request = request
    error.response = response
    return responseFailed(error, response)
}

function responseFailed(error: HttpError, response: HttpResponse) {
    window.$app.emit(HttpEvent.onError, error, response)
    return Promise.reject(error)
}

export class BusinessHttpRequest<Config extends HttpRequestConfig = HttpRequestConfig> extends HttpRequest {
    download<T = any, R = HttpResponse<Blob>>(url: string, params?: T, _object?: Config): Promise<R> {
        const method = (_object?.method || 'GET').toUpperCase()
        return this.instance({
            method,
            url,
            [method === 'GET' ? 'params' : 'data']: params,
            responseType: 'blob',
            ..._object,
        })
    }

    upload<T = any, R = HttpResponse<Blob>>(url: string, params?: T, _object?: Config): Promise<R> {
        return super.form(url, params, _object)
    }

    delete<T = any, R = HttpResponse<any, any>>(
        url: string,
        params?: T | undefined,
        _object?: HttpRequestConfig<any> | undefined,
    ): Promise<R> {
        return this.instance({
            method: 'DELETE',
            url,
            data: params,
            ...(_object || {}),
        })
    }
}

export const http = new BusinessHttpRequest({
    baseURL: import.meta.env.VITE_SERVER_API,
    timeout: 15 * 1000,
    interceptors: {
        requestSucceedInterceptors: requestSucceed,
        requestFailedInterceptors: undefined,
        responseSucceedInterceptors: responseSucceed,
        responseFailedInterceptors: responseFailed as any,
    },
})

// 监听错误
export function handleError() {
    window.$app.on(HttpEvent.onError, (error: HttpError, response: HttpResponse) => {
        const { config } = response
        if (config.toastError === false) {
            return
        }
        ElMessage.error(error.message)
    })
}
