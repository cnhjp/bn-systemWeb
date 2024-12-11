export enum HttpStatus {
    /**
     * 操作成功
     */
    SUCCESS = 1200,
    /**
     * 未授权
     */
    UNAUTHORIZED = 1401,
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

export enum HttpMethod {
    Get = 'get',
    Post = 'post',
    Put = 'put',
    Delete = 'delete',
    Patch = 'patch',
}
