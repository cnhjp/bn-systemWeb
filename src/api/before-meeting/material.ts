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
