import { HttpRequest, HttpError, type HttpResponse, type HttpRequestConfig } from '@package/http'
import type { AxiosResponse } from 'axios'
import { HttpStatus, HttpStatusDescription } from './enums'
import { useUserStore } from '@/store'

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
            const name = decodeURIComponent(headers['content-disposition'].split(';')[1].split('filename=')[1])

            if ('navigator' in window && 'msSaveBlob' in window.navigator) {
                ;(window.navigator as any).msSaveBlob(blob, name)
            } else if ('download' in document.createElement('a')) {
                const link = document.createElement('a')
                link.download = name
                link.style.display = 'none'
                link.href = URL.createObjectURL(blob)
                document.body.appendChild(link)
                link.click()
                URL.revokeObjectURL(link.href)
                document.body.removeChild(link)
            }

            resolve(response)
        } else if ('FileReader' in window) {
            const fileReader = new FileReader()
            fileReader.onload = function () {
                response.data = JSON.parse(this.result as string)
                resolve(response)
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
    config.headers['authorization'] = 'Bearer ' + userStore.token
    return config
}

function responseSucceed(response: HttpResponse) {
    const { status: responseStatus, statusText: responseStatusText, data, config, request } = response
    const result = {
        code: responseStatus || data?.code || 0,
        data: data?.data || data,
        desc: responseStatusText || data?.desc,
    }

    if (result.code === HttpStatus.SUCCESS) {
        if (result.code === 200) {
            if (response.config.responseType === 'blob') {
                if ((response.config as any).download === true) {
                    return responseBlob(response).catch(responseFailed)
                }
            }
        }
        return result
    }

    const status: HttpStatus = result.code || HttpStatus.SYSTEM_ERROR
    const message: string = result.desc || HttpStatusDescription[status]
    const error = new HttpError(message, HttpStatus[status])
    error.status = status
    error.config = config
    error.request = request
    error.response = response
    return responseFailed(error)
}

function responseFailed(error: HttpError) {
    return Promise.reject(error)
}

export const http = new HttpRequest<HttpRequestConfig>({
    baseURL: import.meta.env.VITE_SERVER_API,
    timeout: 15 * 1000,
    interceptors: {
        requestSucceedInterceptors: requestSucceed,
        requestFailedInterceptors: undefined,
        responseSucceedInterceptors: responseSucceed,
        responseFailedInterceptors: responseFailed,
    },
})
