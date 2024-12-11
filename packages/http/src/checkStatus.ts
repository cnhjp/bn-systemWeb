/**
 * @description: 校验网络请求状态码
 * @param {Number} status
 * @return 异常信息
 */
export const checkStatus = (status: number): string => {
    switch (status) {
        case 400:
            return '请求失败！请您稍后重试'
            break
        case 401:
            return '登录失效！请您重新登录'
            break
        case 403:
            return '当前账号无权限访问！'
            break
        case 404:
            return '你所访问的资源不存在！'
            break
        case 405:
            return '请求方式错误！请您稍后重试'
            break
        case 408:
            return '请求超时！请您稍后重试'
            break
        case 500:
            return '服务异常！'
            break
        case 502:
            return '网关错误！'
            break
        case 503:
            return '服务不可用！'
            break
        case 504:
            return '网关超时！'
            break
        default:
            return '请求失败！'
    }
}
