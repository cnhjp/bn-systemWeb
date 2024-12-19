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
    return http.post('/api/hotel/add', query)
}

/**
 * 编辑酒店
 * @param query
 * @returns
 */
export function editHotel(query: HotelForm) {
    return http.post('/api/hotel/update', query)
}

/**
 * 编辑酒店 -- 获取详情
 * @param query
 * @returns
 */
export function detailHotel(id: number | string) {
    console.log('酒店详情', id)
    return Promise.resolve({
        data: {
            id: 121456456,
            name: '雷迪森酒店',
            contact: 15265656565,
            address: '埃里克森大家；蜂蜡这就是；到了开房间',
            introduction: '埃里克森大家；蜂蜡这就是；到了开房间',
            docName: '',
            docId: 0,
            docPath: '',
        },
    })
}

/**
 * 删除酒店
 * @param id
 * @returns
 */
export function deleteHotel(id: number | string) {
    return http.post(`/api/hotel/${id}`)
}
