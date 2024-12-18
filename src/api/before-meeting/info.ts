import { http } from '~/src/utils/http'
import { createQueryParams } from '~/src/utils'

// 获取会议类型下拉
export function getMeetingTypeDrop() {
    return http.get('/api/convention/type')
}

// 获取会议状态下拉
export function getMeetingStatusDrop() {
    return http.get('/api/list/convention-status')
}

// 获取会议列表
export function getMeetingPage(params) {
    return http.get('/api/convention/page?' + createQueryParams(params))
}

// 更新会议排序
export function editSortIndex(params) {
    return http.post('/api/convention/sort-index', params)
}

// 更新会议状态
export function editStatus(id, status) {
    return http.put(`/api/convention/update-status/${id}?status=${status}`)
}

// 删除会议
export function deleteMeeting(id) {
    return http.delete(`/api/convention/${id}`)
}

// 获取会议分组
export function getGroupPage(params) {
    return http.get('/api/convention/group/page', params)
}

// 新增会议分组
export function addGroup(params) {
    return http.post('/api/convention/group/add', params)
}

// 更新会议分组
export function updateGroup(params) {
    return http.post('/api/convention/group/mod', params)
}

// 获取会议分组下拉
export function getGroupDrop() {
    return http.get('/api/convention/group/drop')
}
