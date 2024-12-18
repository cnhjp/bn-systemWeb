import { http } from '~/src/utils'

/**
 * 获取会议室下拉
 * @returns query
 */
export function dropDownMeetingRoom() {
    return http.get('/api/list/meeting-room')
}

/**
 * 获取会议类型下拉
 * @returns query
 */
export function dropDownMeetingType() {
    return http.get('/api/convention/type')
}

/**
 * 获取会议室列表
 * @returns query
 */
export function getMeetingRoomPage(query: any) {
    return http.get('/api/meeting-room/page', query)
}

/**
 * 添加会议室
 * @returns query
 */
export function addMeetingRoom(query: any) {
    return http.post('/api/meeting-room', query)
}

/**
 * 编辑会议室
 * @returns query
 */
export function editMeetingRoom(query: any) {
    return http.put('/api/meeting-room', query)
}

/**
 * 添加会议室预约
 * @returns query
 */
export function addMeetingRoomBook(query: any) {
    return http.post('/api/convention', query)
}

/**
 * 检查会议室预约情况
 * @returns query
 */
export function checkMeetingRoomBook(query: any) {
    return http.post('/api/convention/same-time-convention', query)
}

/**
 * 删除会议室
 * @returns id
 */
export function deleteMeetingRoom(id: number) {
    return http.delete(`/api/meeting-room/${id}`)
}

/**
 * 会议室预约列表
 * @returns query
 */
export function getMeetingRoomEventList(query: any) {
    return http.get(`/api/meeting-room/convention-list`, query)
}
