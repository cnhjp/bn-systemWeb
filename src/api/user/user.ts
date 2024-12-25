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

//获取请假审批统计
export function getLeaveTotal() {
    return http.get('/api/convention/signature/untreated/total')
}

//获取未回复统计
export function getNoReplyTotal() {
    return http.get('/api/inquiry/noReply/count')
}
