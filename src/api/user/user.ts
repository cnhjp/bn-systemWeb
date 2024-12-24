import { http } from '@/utils/http'
import type { LoginByUserRequest, LoginResponse } from './types'
import MenuJson from './menu.json'

export function fetchLogin(data: LoginByUserRequest) {
    return http.post<LoginByUserRequest, LoginResponse>('/api/login/token', data)
}

// export function fetchUserInfo(personId: string) {
//     return http.get('/api/test/getUserById', { personId })
// }

export function fetchUserInfo(personId: number) {
    return http.get('/api/login/getPersonInfo', { personId }, { throwError: true })
}

export function fetchUserMenus() {
    // return http.get('/user/menus')
    return Promise.resolve({
        data: MenuJson,
    })
}
