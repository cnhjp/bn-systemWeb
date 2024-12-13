import { http } from '@/utils/http'
import type { LoginByUserRequest, LoginResponse } from './types'
import MenuJson from './menu.json'

export function fetchLogin(data: LoginByUserRequest) {
    return http.post<LoginByUserRequest, LoginResponse>('/api/login/token', data)
}

// export function fetchUserInfo(personId: string) {
//     return http.get('/api/test/getUserById', { personId })
// }

export function fetchUserInfo() {
    // return http.get('/user/info')
    return Promise.resolve({
        data: {
            userId: 1,
            userName: 'javis',
            userRole: 'admin',
        },
    })
}

export function fetchUserMenus() {
    // return http.get('/user/menus')
    return Promise.resolve({
        data: MenuJson,
    })
}
