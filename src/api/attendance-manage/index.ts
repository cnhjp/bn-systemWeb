import { http } from '~/src/utils/http'

//签到统计
export function overViewAttendance(conventionId: number) {
    return http.get(`/api/convention/${conventionId}/sign/statistics`)
}

// 签到状态
export function dropDownAttendanceStatus() {
    return http.get('/api/convention-person/attend-status/drop')
}

// 签到列表
export function getAttendPage(query: any) {
    return http.post('/api/convention-person/page', query)
}

// 一键全签
export function setAllAttendance(conventionId: number) {
    return http.post(`/api/convention-person/auto-sign`, { conventionId })
}

// 修改状态
export function changeStatus(query: any) {
    return http.post('/api/convention-person/attend-status', query)
}

// 导出人员
export function exportPerson(query: any) {
    return http.download('/api/convention-person/export', query, {
        method: 'POST',
        download: true,
        filename: '签到.xlsx',
    })
}
