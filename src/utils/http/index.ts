import { HttpRequest, HttpError } from '@package/http'
import { HttpStatus, HttpStatusDescription } from './enums'
import type { BusinessConfig, BusinessResponse } from './types'
import { useUserStore, useRouteStore } from '@/store'
import { downloadBlob, isValidJSON } from '../common'

/** 业务异常 */
class BusinessError<T = unknown, D = any> extends HttpError<T, D> {
    declare config?: BusinessConfig
}

/** 设置默认值 */
function defaults<T = any>(...args: { [key: string]: any }[]): T {
    return args.reduce((inst: { [key: string]: any }, next: { [key: string]: any }) => {
        Object.keys(next).forEach((key: string) => {
            if (!(key in inst)) {
                inst[key] = next[key]
            }
        })
        return inst
    }, {}) as T
}
/** Blob下载 */
function handleDownload(response: BusinessResponse) {
    return new Promise((resolve, reject) => {
        const { data, headers, config } = response

        // 流下载
        if (data instanceof Blob && data.type === 'application/octet-stream') {
            const name =
                config.filename ||
                decodeURIComponent(headers['content-disposition'].split(';')[1].split('filename=')[1])
            downloadBlob(data, name)
            resolve(response)
        }
        // 其他文件下载
        else if ('FileReader' in window) {
            const fileReader = new FileReader()
            fileReader.onload = function () {
                if (isValidJSON(this.result as string)) {
                    response.data = JSON.parse(this.result as string)
                    resolve(response)
                } else {
                    const blob = new Blob([data], { type: data.type })
                    downloadBlob(blob, config.filename)
                    resolve(response)
                }
            }
            fileReader.onerror = function (error) {
                reject(error)
            }
            fileReader.readAsText(data as Blob)
        }
        // 下载失败
        else {
            const error = new Error('Download tool not found') as HttpError
            error.status = 404
            error.response = response
            reject(error)
        }
    })
}

/** 请求成功事件 */
function handleRequestSucced(config: BusinessConfig) {
    config = defaults(config, {
        download: true,
        throwError: false,
        toastError: true,
    })

    const userStore = useUserStore()

    config.headers['authorization'] = userStore.token

    return config
}
/** 响应成功事件 */
function handleResponseSucced(response: BusinessResponse) {
    const data = response.data || { code: 0 }
    const config = response.config
    const request = response.request

    const rest = {
        code: data.code,
        data: data.data,
        desc: data.desc,
    }

    if (config.responseType === 'blob' && config.download === true) {
        return handleDownload(response).catch(handleResponseFailed)
    }

    if (rest.code === HttpStatus.SUCCESS) {
        return rest
    }

    const status: string = rest.code || HttpStatus.SYSTEM_ERROR
    const message: string = rest.desc || HttpStatusDescription[status]

    const error = new BusinessError(message, status)
    error.status = rest.code || HttpStatus.SYSTEM_ERROR
    error.config = config
    error.request = request
    error.response = response
    return handleResponseFailed(error)
}
/** 响应失败事件 */
function handleResponseFailed(error: BusinessError) {
    return new Promise((resolve, reject) => {
        const { config, request, response } = error

        const routeStore = useRouteStore()

        if (error.status === HttpStatus.UNAUTHORIZED) {
            routeStore.redirectToLogin(true)
        }

        if (config.toastError === true) {
            ElMessage.error(error.message)
        }

        if (config.throwError === true) {
            reject(error)
        }
    })
}

/** 业务请求类 */
export class BusinessRequest<Config extends BusinessConfig = BusinessConfig> extends HttpRequest {
    download<T = any, R = BusinessResponse<Blob>>(url: string, params?: T, _object?: Partial<Config>): Promise<R> {
        const method = (_object?.method || 'GET').toUpperCase()
        return this.instance({
            method,
            url,
            [method === 'GET' ? 'params' : 'data']: params,
            responseType: 'blob',
            ..._object,
        })
    }

    upload<T = any, R = BusinessResponse<Blob>>(url: string, params?: T, _object?: Config): Promise<R> {
        return super.form(url, params, _object)
    }

    delete<T = any, R = BusinessResponse<any, any>>(
        url: string,
        params?: T | undefined,
        _object?: BusinessConfig<any> | undefined,
    ): Promise<R> {
        return this.instance({
            method: 'DELETE',
            url,
            data: params,
            ...(_object || {}),
        })
    }
}

/** 网络请求 */
export const http = new BusinessRequest({
    baseURL: import.meta.env.VITE_SERVER_API,
    timeout: 15 * 1000,
    interceptors: {
        requestSucceedInterceptors: handleRequestSucced,
        responseSucceedInterceptors: handleResponseSucced,
        responseFailedInterceptors: handleResponseFailed,
    },
})
