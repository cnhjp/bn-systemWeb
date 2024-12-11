import { HttpRequest, HttpError, type HttpResponse, type HttpRequestConfig } from '@package/http'
import { HttpStatus, HttpStatusDescription } from './enums'
import { useUserStore } from '@/store'

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
    baseURL: '/',
    timeout: 15 * 1000,
    interceptors: {
        requestSucceedInterceptors: requestSucceed,
        requestFailedInterceptors: undefined,
        responseSucceedInterceptors: responseSucceed,
        responseFailedInterceptors: responseFailed,
    },
})
