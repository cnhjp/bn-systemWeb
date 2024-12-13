/**
 * 通过账号密码登录请求参数
 */
export interface LoginByUserRequest {
    userName: string
    password: string
    clientID: string
    source: number
}

/**
 * 登录响应对象
 */
export interface LoginResponse {
    data: {
        status: number
        info: {
            appHome: number
            defaultConventionId: number
            expires_in: number
            isForceAPP: boolean
            name: string
            personId: number
            success: boolean
            token: string
            token_type: string
            userName: string
        }
    }
}
