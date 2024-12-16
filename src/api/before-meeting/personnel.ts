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
        downloadName: '参会人员头像',
        method: 'POST',
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
        downloadName: '参会人员.xlsx',
        method: 'POST',
        download: true,
    })
}

// 下载模板
export function downloadTemplate(params?) {
    return http.download('/api/convention-person/download-seatSign-template', params, {
        downloadName: '座签模板.docx',
        method: 'get',
        download: true,
    })
}

// 导出座签
export function downloadSeat(params?) {
    return http.download('/api/convention-person/export-SeatSign', params, {
        downloadName: '座签.docx',
        method: 'post',
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
