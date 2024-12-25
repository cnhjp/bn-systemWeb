import { http } from '@/utils/http'

// 新闻分页
export function getNewsPage(params) {
    return http.get('/api/news/page', params)
}

// 新增
export function addNews(params) {
    return http.post('/api/news/add', params)
}

// 删除
export function deleteNews(id) {
    return http.post(`/api/news/delete/${id}`)
}

// 编辑
export function editNews(params) {
    return http.post('/api/news/update', params)
}

// 详情
export function getNewsDetail(id) {
    return http.get(`/api/news/view/${id}`)
}

// 删除评论
export function deleteNewsComment(id) {
    return http.post(`/api/newscomment/delete/${id}`)
}
