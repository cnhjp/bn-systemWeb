import Axios from 'axios'
import QS from 'qs'
import { Types, DownloadUtil } from '@packages/components/core'
import type {
  AxiosPromise,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosRequestHeaders
} from 'axios'

// 请求超时时间
Axios.defaults.timeout = 15 * 1000
// 取消请求的token对象
const cancelToken = Axios.CancelToken
let cancelSource = cancelToken.source()

/**
 * 设置超时时间
 * @param timeout 超时时间（毫秒）
 */
export function setHttpTimeout(timeout: number): void {
  Axios.defaults.timeout = timeout
}

/**
 * 转换成 FormData 对象
 * @param data 来源对象
 */
function toFormData(data: any) {
  if (data instanceof FormData) return data

  const formData = new FormData()

  if (data instanceof Object) {
    const mapToFormData = (key: string, value: any, index: number): void => {
      if (Types.isArray(value)) {
        value.forEach((itemValue: any, itemIndex: number) => {
          return mapToFormData(`${key}`, itemValue, itemIndex)
        })
      }
      if (Types.isObject(value)) {
        key = key.replace(/\[]$/, `[${index}]`)
        Object.keys(value).forEach((itemKey: string, itemIndex: number) => {
          return mapToFormData(`${key}.${itemKey}`, value[itemKey], itemIndex)
        })
      } else {
        formData.append(key, value)
      }
    }

    Object.keys(data).forEach((key: string, index: number): void => {
      mapToFormData(key, data[key], index)
    })
  }

  return formData
}

/**
 * 通过属性名称模糊匹配查询属性值
 * @param value 查询对象
 * @param prop 属性名称
 */
function fuzzyMatching<T>(value: Record<string, T>, prop: string): T {
  const key =
    Object.keys(value).find((e) => e.toLowerCase() === prop?.toLowerCase()) ||
    ''
  return value[key]
}

/**
 * 当响应类型为二进制流（Blob）时，下载数据
 * @param response
 */
function downloadBlob(response: AxiosResponse<any, Blob>) {
  try {
    const content = response.data
    const headers = response.headers
    const filename = decodeURI(
      headers['content-disposition']?.split(';')[1]?.split('filename=')[1]
    )
    DownloadUtil(content, filename)
    return response
  } catch (error) {
    return Promise.reject(error)
  }
}

/**
 * http库
 */
export default class HttpLibrary {
  instance: AxiosInstance

  /**
   * 构造函数
   */
  constructor() {
    this.instance = Axios.create()
    this.interceptors()
  }

  /**
   * 拦截器
   */
  interceptors() {
    const onRequestFulfilled = (config: AxiosRequestConfig) => {
      config.cancelToken = cancelSource.token
      return this.onRequestFulfilled(config)
    }
    const onRequestRejected = (error: any) => {
      return this.onRequestRejected(error)
    }
    this.instance.interceptors.request.use(
      onRequestFulfilled,
      onRequestRejected
    )

    const onResponseFulfilled = (response: AxiosResponse) => {
      return this.onResponseFulfilled(response)
    }
    const onResponseRejected = (error: any) => {
      return this.onResponseRejected(error)
    }
    this.instance.interceptors.response.use(
      onResponseFulfilled,
      onResponseRejected
    )
  }

  /**
   * 发起请求前调用
   * @param config 配置信息
   */
  onRequestBefore(config: AxiosRequestConfig): Promise<AxiosRequestConfig> {
    const headers = config.headers || {}
    const contentType = fuzzyMatching(headers, 'content-type')
    // 当 content-type 为 数据表类型 时，需要将参数对象序列化成URL的形式，以&进行拼接。
    if (
      String(contentType).toLowerCase() === 'application/x-www-form-urlencoded'
    ) {
      if (config.transformRequest === undefined) {
        config.transformRequest = []
      }
      if (config.transformRequest instanceof Function) {
        config.transformRequest = [config.transformRequest]
      }
      config.transformRequest.push(
        (data: any, headers?: AxiosRequestHeaders) => {
          return data instanceof Object ? QS.stringify(data) : data
        }
      )
    }

    return Promise.resolve(config)
  }

  /**
   * 请求成功回调
   * @param config 配置信息
   */
  onRequestFulfilled(config: AxiosRequestConfig): Promise<AxiosRequestConfig> {
    return Promise.resolve(config)
  }

  /**
   * 请求失败回调
   * @param error 异常信息
   */
  onRequestRejected(error: any): Promise<any> {
    return Promise.reject(error)
  }

  /**
   * 响应成功回调
   * @param response 响应信息
   */
  onResponseFulfilled(response: AxiosResponse): Promise<AxiosResponse> {
    return Promise.resolve(response)
  }

  /**
   * 响应失败回调
   * @param error 异常信息
   */
  onResponseRejected(error: any): Promise<any> {
    if (error instanceof Axios.Cancel) {
      error = new Error(error.message)
      error.cancel = true
    }
    return Promise.reject(error)
  }

  /**
   * 发起请求
   * @param config 配置信息
   */
  request<R>(config: AxiosRequestConfig): AxiosPromise<R> {
    return this.onRequestBefore(config || {}).then((config) => {
      return this.instance(config)
    })
  }

  /**
   * 发起 GET 请求
   * @param url 请求地址
   * @param data 请求参数
   * @param config 配置信息
   */
  get<T, R>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig
  ): AxiosPromise<R> {
    return this.request<R>({
      method: 'GET',
      url: url,
      params: data,
      ...config
    })
  }

  /**
   * 发起 POST 请求
   * @param url 请求地址
   * @param data 请求参数
   * @param config 配置信息
   */
  post<T, R>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig
  ): AxiosPromise<R> {
    return this.request<R>({
      method: 'POST',
      url: url,
      data: data,
      ...config
    })
  }

  /**
   * 发起 PUT 请求
   * @param url 请求地址
   * @param data 请求参数
   * @param config 配置信息
   */
  put<T, R>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig
  ): AxiosPromise<R> {
    return this.request<R>({
      method: 'PUT',
      url: url,
      data: data,
      ...config
    })
  }

  /**
   * 发起 delete 请求
   * @param url 请求地址
   * @param data 请求参数
   * @param config 配置信息
   */
  delete<T, R>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig
  ): AxiosPromise<R> {
    return this.request<R>({
      method: 'DELETE',
      url: url,
      data: data,
      ...config
    })
  }

  /**
   * 发起 POST 请求
   * @param url 请求地址
   * @param data 请求参数
   * @param config 配置信息
   */
  form<T, R>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig
  ): AxiosPromise<R> {
    return this.request<R>({
      method: 'POST',
      url: url,
      data: toFormData(data),
      headers: { 'Content-Type': 'multipart/form-data' },
      ...config
    })
  }

  /**
   * 发起 POST 请求，响应数据类型为 Blob 类型，下载数据
   * @param url 请求地址
   * @param data 请求参数
   * @param config 配置信息
   */
  download<T>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig
  ): AxiosPromise<Blob> {
    const method = (config?.method || 'GET').toUpperCase()
    return this.request<Blob>({
      method: method,
      url: url,
      [method === 'GET' ? 'params' : 'data']: data,
      responseType: 'blob',
      ...config
    }).then(downloadBlob)
  }

  /**
   * 请求及中断Promise调用链
   * @param message 中断信息
   */
  cancel(message: string): void {
    cancelSource.cancel(message || 'Interrupt call chain')
    cancelSource = cancelToken.source()
  }
}
