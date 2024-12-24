import { http } from '~/src/utils'
import { HotelForm, HotelListResponse } from './types'

/**
 * 获取酒店列表
 * @param query
 * @returns
 */
export function getHotelPage(query: any) {
    return http.get<any, HotelListResponse>('/api/hotel/page', query)
}

/**
 * 添加酒店
 * @param query
 * @returns
 */
export function addHotel(query: HotelForm) {
    return http.form('/api/hotel/add', query)
}

/**
 * 编辑酒店
 * @param query
 * @returns
 */
export function editHotel(query: HotelForm) {
    return http.form('/api/hotel/update', query)
}

/**
 * 编辑酒店 -- 获取详情
 * @param query
 * @returns
 */
export function detailHotel(id: number | string) {
    return http.get(`/api/hotel/${id}`)
}

/**
 * 删除酒店
 * @param id
 * @returns
 */
export function deleteHotel(id: number | string) {
    return http.post(`/api/hotel/${id}`)
}
