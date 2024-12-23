import { http } from '~/src/utils/http'

/**
 * 获取请假列表
 * @param params
 * @returns
 */
export function getTakeLeavePage(params) {
    return http.get('/api/convention/signature/page', params)
}

// 删除请假
export function deleteTakeLeave(id) {
    return http.post(`/api/convention/signature/${id}/del`)
}

// 获取请假详情
export function getTakeLeaveDetail(id) {
    return http.post(`/api/convention/signature/${id}/info`)
}

// 新增请假
export function addTakeLeave(params) {
    return http.post('/api/convention/signature/add', params)
}

// 更新请假
export function updateTakeLeave(params) {
    return http.post('/api/convention/signature/mod', params)
}

// 同意请假
export function setTakeLeavePassed(id) {
    return http.post(`/api/convention/signature/${id}/pass`)
}

// 不同意请假
export function setTakeLeaveNotPassed(id) {
    return http.post(`/api/convention/signature/${id}/fail`)
}
