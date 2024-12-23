export enum HttpStatus {
    /**
     * 操作成功
     */
    SUCCESS = 1200,
    /**
     * 未授权
     */
    UNAUTHORIZED = 401,
    /**
     * 禁止访问
     */
    FORBIDDEN = 1403,
    /**
     * 系统异常
     */
    SYSTEM_ERROR = 1500,
    /**
     * 网关异常
     */
    GATEWAY_ERROR = 1502,
    /**
     * 自定义异常
     */
    CUSTOM_ERROR = 1601,
    /**
     * 警告
     */
    WARNING = 1602,
    /**
     * 无权限
     */
    PERMISSION_DENIED = 1603,
    /**
     * 产品未授权
     */
    ACTIVATION_ERROR = 2000,
}

export const HttpStatusDescription = {
    [HttpStatus.SUCCESS]: '操作成功',
    [HttpStatus.UNAUTHORIZED]: '未授权',
    [HttpStatus.FORBIDDEN]: '禁止访问',
    [HttpStatus.SYSTEM_ERROR]: '系统异常',
    [HttpStatus.GATEWAY_ERROR]: '网关异常',
    [HttpStatus.CUSTOM_ERROR]: '自定义异常',
    [HttpStatus.WARNING]: '警告',
    [HttpStatus.PERMISSION_DENIED]: '无权限',
    [HttpStatus.ACTIVATION_ERROR]: '产品未授权',
}

export enum HttpMethod {
    Get = 'get',
    Post = 'post',
    Put = 'put',
    Delete = 'delete',
    Patch = 'patch',
}
