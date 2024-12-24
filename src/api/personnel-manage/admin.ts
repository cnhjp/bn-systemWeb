import { http } from '~/src/utils/http'

// 获取管理员分页
export function getAdminPage(params) {
    return http.get('/api/person/subadmin-page', params)
}

// 批量删除
export function deleteAdmin(params) {
    return http.delete('/api/person/subadmin', params)
}

// 选择管理员
export function getChooseAdminPage(params) {
    return http.get('api/person/subadmin-select-page', params)
}

// 添加
export function addAdmin(params) {
    return http.post('/api/person/subadmin', params)
}
