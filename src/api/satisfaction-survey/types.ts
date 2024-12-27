export interface SatisfactionSurvey {
    id: number
    meetingService: number
    hotelService: number
    mealService: number
    trafficService: number
    remark:string
    createTime: string
    createPerson: string
}

/**
 * 在线咨询--列表
 */
export interface SatisfactionSurveyResponse {
    total: number
    rows: SatisfactionSurvey[]
}
