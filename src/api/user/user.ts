import { http } from '@/utils/http'
import type { LoginByUserRequest, LoginResponse } from './types'

export function fetchLogin(data: LoginByUserRequest) {
    return http.post<LoginByUserRequest, LoginResponse>('/api/login/token', data)
}

export function fetchUserInfo() {
    return http.get('/user/info')
}

export function fetchUserMenus() {
    return http.get('/user/menus')
}
