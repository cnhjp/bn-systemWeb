import { http } from '~/src/utils'
export * from './types.ts'

/**
 * 获取会议室类型下拉
 * @returns query
 */
export function dropDownMeetingRoomType() {
    return http.get('/api/meeting-room/room-type/drop')
}

/**
 * 获取会议室状态下拉
 * @returns query
 */
export function dropDownMeetingRoomStatus() {
    return http.get('/api/meeting-room/room-status/drop')
}

/**
 * 获取场地类型下拉
 * @returns query
 */
export function dropDownVenueType() {
    return http.get('/api/meeting-room/venue-type/drop')
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
    return http.form('/api/meeting-room/add', query)
}

/**
 * 编辑会议室--获取详情
 * @returns id
 */
export function detailMeetingRoom(id: number | string) {
    return http.get(`/api/meeting-room/${id}/info`)
}

/**
 * 编辑会议室
 * @returns query
 */
export function editMeetingRoom(query: any) {
    return http.form('/api/meeting-room/mod', query)
}

/**
 * 删除会议室
 * @returns id
 */
export function deleteMeetingRoom(id: number) {
    return http.post(`/api/meeting-room/${id}/del`)
}
