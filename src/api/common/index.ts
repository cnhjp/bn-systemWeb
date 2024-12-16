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

