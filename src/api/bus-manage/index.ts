import { http } from '~/src/utils'

/**
 * 获取班车分页列表
 * @returns
 */
export function getBusPage(params: any) {
    return http.get('/api/traffic/page', params)
}

/**
 * 批量删除班车
 * @param params
 * @returns
 */
export function batchDeleteBus(params: number[]) {
    return http.delete('/api/traffic/deleteByIdList', params)
}

/**
 * 保存班车
 * @param params
 * @returns
 */
export function saveBus(params: any) {
    return http.post('/api/traffic/save', params)
}
