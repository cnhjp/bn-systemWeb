//import { http } from '~/src/utils'
import { HotelForm, HotelListResponse } from './types'

/**
 * 获取酒店列表
 * @param query
 * @returns
 */
export function getHotelPage() {
    return Promise.resolve<HotelListResponse>({
        data: {
            total: 2,
            rows: [
                {
                    id: 12,
                    name: '雷迪森酒店',
                    contact: 123456789,
                    address: '金华市白龙桥',
                },
                {
                    id: 133,
                    name: '豪森假日酒店',
                    contact: 123456789,
                    address: '金华市白龙桥',
                },
            ],
        },
    })
}

/**
 * 添加酒店
 * @param query
 * @returns
 */
export function addHotelForm(query: HotelForm) {
    console.log('添加酒店', query)
    return Promise.resolve({
        data: 'success',
    })
}

/**
 * 添加酒店
 * @param id
 * @returns
 */
export function deleteHotel(id: number) {
    console.log('添加酒店', id)
    return Promise.resolve({
        data: 'success',
    })
}
