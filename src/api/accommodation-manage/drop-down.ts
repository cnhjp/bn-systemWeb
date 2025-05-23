import { http } from '~/src/utils'
import { DropResponseData } from './types'

/**
 * 房间类型下拉
 * @param
 * @returns
 */
export function dropDownRoomType() {
    return http.get<any, DropResponseData>('/api/hotel-room/room-type')
}

/**
 * 酒店下拉
 * @param
 * @returns
 */
export function dropDownHotelType() {
    return http.get<any, DropResponseData>('/api/hotel/dropdownlist')
}

/**
 * 会议角色下拉
 * @param
 * @returns
 */
export function dropDownPersonRole() {
    return http.get<any, DropResponseData>('/api/hotel-room/person-role')
}

/**
 * 满员状态下拉
 * @param
 * @returns
 */
export function dropDownRoomStatus() {
    return Promise.resolve({
        data: [
            {
                label: '全部',
                value: 0,
            },
            {
                label: '未满员',
                value: 1,
            },
            {
                label: '已满员',
                value: 2,
            },
        ],
    })
}
