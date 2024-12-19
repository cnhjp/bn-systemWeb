import { http } from '~/src/utils/http'

// 获取公告列表
export function getNoticePage(params) {
    return http.get('/api/notice/page', params)
}

// 批量删除公告
export function batchDeleteNotice(params) {
    return http.delete('/api/notice/deleteByIdList', params)
}

// 保存公告
export function saveNotice(params) {
    return http.post('/api/notice/save', params)
}

// 发布公告
export function publishNotice(params) {
    return http.post('/api/notice/updatepublish', params)
}
