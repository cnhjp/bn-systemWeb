import { http } from '~/src/utils'
import { OnlineConsultationListResponse, OnlineConsultationDetail } from './types'

/**
 * 获取在线咨询
 * @param query
 * @returns
 */
export function getOnlineConsultationPage(query: any) {
    return http.get<OnlineConsultationListResponse>('/api/inquiry/page', query)
}

/**
 * 获取在线咨询详情
 * @param id
 * @returns
 */
export function detailOnlineConsultation(query: any) {
    return http.get<OnlineConsultationDetail>('/api/inquiry/info', query)
}

/**
 * 回复在线咨询
 * @param query
 * @returns
 */
export function replyOnlineConsultation(query: any) {
    return http.form('/api/inquiry/reply', query)
}
