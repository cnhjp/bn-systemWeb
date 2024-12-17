import { http } from '@/utils/http'

/**
 * 获取分类列表
 * @param params
 * @returns
 */
export function getCategoryList(params) {
    return http.get('/api/Convention-Category/list', params)
}

// 删除分类
export function deleteCategory(id) {
    return http.delete(`/api/Convention-Category/${id}`)
}

/***
 * 批量删除
 */
export function batchDeleteCategory(params) {
    return http.post('/api/Convention-Category/multi-delete', params)
}

// 更新分类
export function updateCategory(params) {
    return http.put('/api/Convention-Category', params)
}

// 新增分类
export function addCategory(params) {
    return http.post('/api/Convention-Category', params)
}

// 复制分类
export function copyCategory(params) {
    return http.post('/api/Convention-Category/copy-category', params)
}

// 获取非默认分类的材料列表
export function getNonDefaultMaterialList(params) {
    return http.get('/api/Convention-Category/file-list', params)
}

// 获取默认分类的材料列表
export function getDefaultMaterialList(params) {
    return http.get('/api/agenda/list', params)
}

// 下载议题模板
export function downloadAgendaTemplate() {
    return http.download(
        '/api/agenda/downAgendaZipTemplate',
        {},
        {
            method: 'get',
            downloadName: '一键上传议题模板.zip',
            download: true,
        },
    )
}

// 上传文件
export function uploadFile(params) {
    return http.post('/api/Convention-Category/upload-file', params)
}

// 删除议程文件
export function deleteFile(id) {
    return http.delete(`/api/Convention-Category/file/${id}`)
}

export function deleteAgendaFile(id) {
    return http.delete(`/api/agenda/document/${id}`)
}

// 删除议程
export function deleteAgenda(id) {
    return http.delete(`/api/agenda/${id}`)
}

// 批量删除议程文件
export function deleteAgendaFiles(params) {
    return http.delete('/api/agenda/deleteAgendaAndDocList', params)
}

// 新增议程
export function addAgenda(params) {
    return http.post('/api/agenda', params)
}

// 更新议程
export function updateAgenda(params) {
    return http.put('/api/agenda', params)
}

// 获取议程详情
export function getAgendaDetail(id) {
    return http.get(`/api/agenda/${id}`)
}
