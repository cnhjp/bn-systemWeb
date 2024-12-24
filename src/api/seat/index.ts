import { http } from '@/utils'

// 会议列表
export function conventionDrop(params) {
    return http.get('/api/convention/drop', params)
}

// 座席图下拉列表
export function seatLayoutDropList(params) {
    return http.get('/api/convention-seat/seat-layout-drop-list', params)
}

// 座席图列表
export function seatLayoutList(params) {
    return http.get('/api/convention-seat/seat-layout-List', params)
}

// 新增座席图
export function addSeatLayout(data) {
    return http.post('/api/convention-seat/seat-layout', data)
}

// 编辑座席图
export function updateSeatLayout(data) {
    return http.put('/api/convention-seat/seat-layout', data)
}

// 删除座席图
export function deleteSeatLayout({ id }) {
    return http.delete(`/api/convention-seat/seat-layout/${id}`)
}

// 座席图详情
export function seatLayoutInfo({ id }) {
    return http.get(`/api/convention-seat/seat-layout-Info/${id}`)
}

// 人员列表
export function personList(params) {
    return http.get('/api/convention-seat/person-list', params)
}

// 坐席修改
export function saveSeat(data) {
    return http.post('/api/convention-seat/seat', data)
}

// 坐席复制
export function seatCopy(data) {
    return http.post('/api/convention-seat/copy', data)
}

// 会议座席图列表
export function seatPage(params) {
    return http.get('/api/convention-seat/page', params)
}

// 座席监测
export function seatMonit(params) {
    return http.get('/api/agenda/seat-monit', params)
}

// 区域列表
export function seatAreaList(params) {
    return http.get('/api/convention-seat/seat-area-list', params)
}

// 新增区域
export function addArea(data) {
    return http.post('/api/convention-seat/seat-area', data)
}

// 修改区域
export function updateArea(data) {
    return http.put('/api/convention-seat/seat-area', data)
}

// 修改区域人员排序
export function seatAreaPersonSort(data) {
    return http.post('/api/convention-seat/seat-area-person-sort', data)
}

// 修改
export function setSeatDirection(params) {
    return http.get('/api/convention-seat/direction', params)
}

// 修改座位号规则
export function arrangeStatus(params) {
    return http.get('/api/convention-seat/arrange-status', params)
}

// 同步座位号
export function saveSeatToConventionperson(data) {
    return http.post('/api/convention-seat/save-seat-to-conventionperson', data)
}
// 保存座位表序号
export function saveSeatSortNum(data) {
    return http.post('/api/convention-seat/saveSortNum', data)
}

/** 保存预览图 */
export function savePreview(id, file) {
    const formData = new FormData()
    formData.append('file', file)
    return http.post(`/api/convention-seat/${id}/preview`, formData)
}
