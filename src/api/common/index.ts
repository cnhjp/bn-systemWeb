import { http } from '~/src/utils'

// 分组
export function getPersonGroupDrop(params) {
    return http.get('/api/list/person-group', params)
}

// 人员角色
export function getPersonRoleDrop(params) {
    return http.get('/api/list/person-role', params)
}

// 人员状态
export function getPersonAttendStatusDrop(params) {
    return http.get('/api/list/person-attend-status', params)
}

// 获取有无公布大会
export function hasActive(params?) {
    return http.get('/api/convention/has-active', params)
}

// 工作人员角色
export function getStaffRoleDrop(params) {
    return http.get('/api/list/staff-role', params)
}

// 上传文件
export function uploadDocument(params) {
    return http.upload('/api/document', params)
}
