import {http} from '~/src/utils'
import {SatisfactionSurveyResponse} from './types'

/**
 * 获取在线咨询
 * @param query
 * @returns
 */
export function getSatisfactionSurveyPage(query: any) {
    return http.get<SatisfactionSurveyResponse>('/api/convention-satisfaction-survey/page', query)
}
