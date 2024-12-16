import { http } from '@/utils/http'

// 从其他大会覆盖参会人员
export function getCoverByConvention(params: any) {
    return http.get('/api/convention-person/cover-by-convention', params)
}

// 获取参会人员及工作人员Tab数量
export function getConventionPersonTabCount(params) {
    return http.get('/api/convention-person/tab-count', params)
}

// 参会人员列表
export function getConventionPersonPage(params) {
    return http.post('/api/convention-person/page', params)
}

// 删除人员
export function deleteConventionPerson(id: number | string) {
    return http.delete('/api/convention-person/' + id)
}

// 批量删除人员
export function batchDeleteConventionPerson(params) {
    return http.post('/api/convention-person/deletes', params)
}

// 更新状态批量
export function batchConventionPersonAttendtSatus(params) {
    return http.post('/api/convention-person/attend-status', params)
}

// 允许同屏
export function updateScreen(params) {
    return http.post('/api/convention-person/update-screen', params)
}
