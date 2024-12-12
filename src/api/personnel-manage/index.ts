import { http } from '~/src/utils'

/**
 * 获取人员分页列表
 * @param params
 * @returns
 */
export function getPersonnelPage(params: any) {
    return http.get('/api/person/page', params)
}

/**
 * 更新排序
 * @param params
 * @returns
 */
export function editSortIndex(params: any) {
    return http.post('/api/person/saveSortNum', params)
}

/**
 * 删除人员
 * @param params
 * @returns
 */
export function deletePersonnel(params: number[]) {
    return http.delete('/api/person', { data: params })
}

/**
 * 下载模板
 * @returns
 */
export function downloadTemplate() {
    return http.download(
        '/api/person/download-template',
        {},
        {
            download: true,
        },
    )
}
