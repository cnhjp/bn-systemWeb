import { http } from '@/utils/http'

export function fetchLogin(username: string, password: string) {
    return http.post('/user/login', { username, password })
}

export function fetchUserInfo() {
    return http.get('/user/info')
}

export function fetchUserMenus() {
    return http.get('/user/menus')
}
