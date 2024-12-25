import { http } from '@/utils/http'

// 从其他大会覆盖参会人员
export function getCoverByConvention(params: any) {
    return http.get('/api/convention-person/cover-by-convention', params)
}

// 获取参会人员及工作人员Tab数量
export function getConventionPersonTabCount(params) {
    return http.get('/api/convention-person/tab-count', params)
}

// 参会人员列表
export function getConventionPersonPage(params) {
    return http.post('/api/convention-person/page', params)
}

// 删除人员
export function deleteConventionPerson(id: number | string) {
    return http.delete('/api/convention-person/' + id)
}

// 批量删除人员
export function batchDeleteConventionPerson(params) {
    return http.post('/api/convention-person/deletes', params)
}

// 更新状态批量
export function batchConventionPersonAttendtSatus(params) {
    return http.post('/api/convention-person/attend-status', params)
}

// 允许同屏
export function updateScreen(params) {
    return http.post('/api/convention-person/update-screen', params)
}

// 获取参会人员及工作人员信息
export function conventionPersonInfo(params) {
    return http.get('/api/convention-person/info', params)
}

// 更新参会人员
export function updateConventionPerson(params) {
    return http.put('/api/convention-person', params)
}

// 导出照片
export function downloadPhoto(params) {
    return http.download('/api/convention-person/export-photo', params, {
        method: 'POST',
        filename: '参会人员头像',
        download: true,
    })
}

// 导出人员字段
export function conventionPersonExportField(params?) {
    return http.get('/api/convention-person/export-field', params)
}

// 导出人员
export function downloadPersonnel(params) {
    return http.download('/api/Convention-Person/export', params, {
        method: 'POST',
        filename: '参会人员.xlsx',
        download: true,
    })
}

// 下载模板
export function downloadTemplate(params?) {
    return http.download('/api/convention-person/download-seatSign-template', params, {
        method: 'GET',
        filename: '座签模板.docx',
        download: true,
    })
}

// 导出座签
export function downloadSeat(params?) {
    return http.download('/api/convention-person/export-SeatSign', params, {
        method: 'POST',
        filename: '座签.docx',
        download: true,
    })
}

// 座签预览
export function previewSeatSignTemplate(params?) {
    return http.get('/api/convention-person/preview-seatSign-template', params)
}

// 上传座签模板
export function uploadSeatSignTemplate(data) {
    return http.form('/api/convention-person/upload-seatSign-template', data, {
        method: 'post',
    })
}

// 获取最大参会人数
export function getAuthConventionPersonCount(params?) {
    return http.get('/api/convention-person/getAuthConventionPersonCount', params)
}

// 新增参会人员
export function addConventionPerson(params?) {
    return http.post('/api/convention-person/add', params)
}

// 获取工作人员
export function getStaffPage(params) {
    return http.post('/api/Convention-Staff/page', params)
}

// 获取参会人员及工作人员信息
export function conventionStaffInfo(params) {
    return http.get('/api/convention-staff/info', params)
}

// 更新工作人员
export function updateConventionStaff(params) {
    return http.put('/api/convention-staff', params)
}

// 导出工作人员字段
export function conventionStaffExportField(params?) {
    return http.get('/api/convention-staff/export-field', params)
}

// 导出工作人员
export function downloadStaff(params) {
    return http.download('/api/Convention-Staff/export', params, {
        method: 'POST',
        filename: '参会人员.xlsx',
        download: true,
    })
}
