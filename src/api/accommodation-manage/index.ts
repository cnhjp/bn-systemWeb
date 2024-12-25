import { http } from '~/src/utils'
import { roomFormResponse } from './types.ts'
export * from './drop-down.ts'

/**
 * 住宿人员列表
 * @param query
 * @returns
 */
export function getPersonPage(query: any) {
    return http.get<any, any>('/api/hotel-room/person-page', query)
}

/**
 * 住宿人员列表--人员选择
 * @param query
 * @returns
 */
export function getSelectPersonPage(query: any) {
    return http.post<any, any>('/api/convention-person/pop-page-for-hotel-list', query)
}

/**
 * 设置房间要求
 * @param query
 * @returns
 */
export function settingRoomType(query: any) {
    return http.post<any, any>('/api/hotel-room/room-type-require', query)
}

/**
 * 住宿安排列表
 * @param query
 * @returns
 */
export function getRoomPage(query: any) {
    return http.get<any, any>('/api/hotel-room/page', query)
}

/**
 * 一键安排
 * @param query
 * @returns
 */
export function setArrange(query: any) {
    return http.get<any, any>('/api/hotel-room/arrange', query)
}

/**
 * 住宿安排-批量删除
 * @param query
 * @returns
 */
export function batchDeleteRoom(query: any) {
    return http.delete<any, any>('/api/hotel-room', query)
}

/**
 * 住宿安排-删除人员
 * @param id
 * @returns
 */
export function deletePerson(id: number) {
    return http.delete<any, any>(`/api/hotel-room/person/${id}`)
}

/**
 * 住宿安排-安排人员
 * @param query
 * @returns
 */
export function setRoomPerson(query: any) {
    return http.post<any, any>(`/api/hotel-room/person`, query)
}

/**
 * 住宿安排-新增安排
 * @param query
 * @returns
 */
export function addRoom(query: any) {
    return http.post<any, roomFormResponse>(`/api/hotel-room`, query)
}

/**
 * 住宿安排-获取详情
 * @param id
 * @returns
 */
export function detailRoom(id: any) {
    return http.get<any, roomFormResponse>(`/api/hotel-room/info/${id}`)
}

/**
 * 住宿安排-导出
 * @param query
 * @returns
 */
export function exportHotelRoom(query: any) {
    return http.download<any, any>('/api/hotel-room/export', query, {
        filename: '住宿安排.xlsx',
        method: 'GET',
        download: true,
    })
}

/**
 * 设置入住时间--获取默认时间
 * @param query
 * @returns
 */
export function detailTimeConfig(conventionId: number) {
    return http.get<any, any>('/api/hotel-room/config/get', { conventionId })
}

/**
 * 设置入住时间
 * @param query
 * @returns
 */
export function setTimeConfig(query: any) {
    return http.post<any, any>('/api/hotel-room/config/save', query)
}
