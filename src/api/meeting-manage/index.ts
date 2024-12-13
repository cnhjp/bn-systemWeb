import { http } from '~/src/utils'

/**
 * 获取会议下拉
 * @returns
 */
export function getMeetingDrop() {
    return http.get('/api/convention/drop')
}
