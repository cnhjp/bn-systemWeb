import { http } from '~/src/utils'

/**
 * 用餐地点
 * @param
 * @returns
 */
export function dropDownMealAddress(query: any) {
    return http.get<any, any>('/api/list/eatAddress-drop', query)
}

/**
 * 统计时长
 * @param
 * @returns
 */
export function dropDownTimedStatus() {
    return http.get<any, any>('/api/conferenceEat/timed-status')
}

/**
 * 获取统计数据
 * @param
 * @returns
 */
export function getMealsTotal(query: any) {
    return http.get<any, any>('/api/conferenceEat/chart-total', query)
}

/**
 * 获取用餐列表
 * @param
 * @returns
 */
export function getMealPage(query: any) {
    return http.get<any, any>('/api/conferenceEat/page', query)
}

/**
 * 添加用餐
 * @param
 * @returns
 */
export function addMeals(query: any) {
    return http.post<any, any>('/api/conferenceEat/addModels', query)
}

/**
 * 编辑用餐--详情
 * @param
 * @returns
 */
export function detailMeals(id: number) {
    return http.get<any, any>('/api/conferenceEat/editView', { id })
}

/**
 * 编辑用餐
 * @param
 * @returns
 */
export function editMeals(query: any) {
    return http.post<any, any>('/api/conferenceEat/save', query)
}

/**
 * 删除用餐
 * @param
 * @returns
 */
export function deleteMeals(query: any) {
    return http.delete<any, any>('/api/conferenceEat/deleteByIdList', query)
}

/**
 * 获取用餐地点列表
 * @param query
 * @returns
 */
export function getMealAddressPage(query: any) {
    return http.get('/api/conferenceEat/addressPage', query)
}

/**
 * 新增用餐地址
 * @param query
 * @returns
 */
export function addMealAddress(query: any) {
    return http.post('/api/conferenceEat/saveAddressList', query)
}

/**
 * 删除用餐地址
 * @param query
 * @returns
 */
export function deleteMealAddress(query: any) {
    return http.delete('/api/conferenceEat/deleteAddressByIdList', query)
}

/**
 * 新增用餐地址
 * @param query
 * @returns
 */
export function exportMeals(query: any) {
    return http.download('/api/conferenceEat/exportPage', query, {
        filename: '用餐安排.xlsx',
        method: 'POST',
        download: true,
    })
}
