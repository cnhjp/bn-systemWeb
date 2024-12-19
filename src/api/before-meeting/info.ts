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

// 删除会议分组
export function deleteGroup(params) {
    return http.post('/api/convention/group/del', params)
}

// 获取会议分组下拉
export function getGroupDrop() {
    return http.get('/api/convention/group/drop')
}

// 会议室列表
export function getMeetingRoomList(params) {
    return http.get('/api/list/meeting-room', params)
}

// 会议类型列表
export function conventionTypeList() {
    return http.get('/api/convention/type')
}

// 获取会议类型设置
export function getTypeSettingList() {
    return http.get('/api/convention-type/list')
}

// 删除类型配置
export function deleteTypeSetting(id) {
    return http.delete(`/api/convention-type/${id}`)
}

// 新增类型配置
export function addTypeSetting(params) {
    return http.post('/api/convention-type', params)
}

// 更新类型配置
export function updateTypeSetting(params) {
    return http.put('/api/convention-type', params)
}

// 分类列表
export function categoryList(params) {
    return http.get('/api/Convention-Category/list', params)
}

// 添加会议
export function addMeeting(params) {
    return http.post('/api/convention', params)
}

// 编辑会议
export function editMeeting(params) {
    return http.put('/api/convention', params)
}

// 获取会议详情
export function getMeetingDetail(id) {
    return http.get(`/api/convention/${id}`)
}

// 获取会议会徽列表
export function getEmblemList() {
    return http.get('/api/convention-emblem/list')
}

// 获取会议会徽下拉
export function getEmblemDrop() {
    return http.get('/api/list/emblem-list')
}

// 删除会议会徽
export function deleteEmblem(id) {
    return http.delete(`/api/convention-emblem/${id}`)
}

// 更新会议会徽
export function updateEmblem(params) {
    return http.post('/api/convention-emblem', params)
}
