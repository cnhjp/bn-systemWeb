import {http} from '~/src/utils'

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
 * 添加人员
 * @param params
 * @returns
 */
export function addPersonnel(params: any) {
    return http.post('/api/person', params)
}

/**
 * 更新人员
 * @param params
 * @returns
 */
export function editPersonnel(params: any) {
    return http.put('/api/person', params)
}

/**
 * 获取人员详情
 * @param id
 * @returns
 */
export function getPersonnelDetail(id: number) {
    return http.get('/api/person/' + id)
}

/**
 * 删除人员
 * @param params
 * @returns
 */
export function deletePersonnel(params: number[]) {
    console.log('params is ', params)
    return http.delete('/api/person', params)
}

/**
 * 检查人员账号绑定
 * @param params
 * @returns
 */
export function checkPersonAccountBind(params: number[]) {
    return http.post('/api/person/checkPersonAccountBind', params)
}

/**
 * 重置密码
 * @param params
 * @returns
 */
export function resetPassword(id: number) {
    return http.post('/api/person/resetPassword?id=' + id, { id })
}

/**
 * 批量重置密码
 * @param params
 * @returns
 */
export function batchResetPassword(params: any) {
    return http.post('/api/person/multi-resetPassword', params)
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
            downloadName: '人员导入模板.xlsx',
        },
    )
}

/***
 * 检查导入人员
 */
export function checkImport(params: { file: File }) {
    return http.form('/api/person/checkImport', params)
}

/**
 * 导入人员
 * @param formData
 * @returns
 */
export function importPersonnel(formData: FormData) {
    return http.post('/api/person/import', formData)
}
