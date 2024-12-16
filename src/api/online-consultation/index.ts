//import { http } from '~/src/utils'
import { OnlineConsultationListResponse, OnlineConsultationDetail, reply } from './types'

/**
 * 获取在线咨询
 * @param query
 * @returns
 */
export function getOnlineConsultationPage() {
    return Promise.resolve({
        data: <OnlineConsultationListResponse>{
            total: 2,
            rows: [
                {
                    id: 12,
                    name: '张三',
                    problem: '金华市白龙桥',
                    status: 1,
                },
                {
                    id: 133,
                    name: '李四',
                    problem: '金华市白龙桥',
                    status: 2,
                },
            ],
        },
    })
}

/**
 * 获取在线咨询详情
 * @param query
 * @returns
 */
export function detailOnlineConsultation() {
    return Promise.resolve({
        data: <OnlineConsultationDetail>{
            id: 12,
            title: '关于XXXXXXXXXX',
            content:
                '贾老师的积分卡就是的离开减肥；埃里克森大家；发了，。健康码；睡了哦减肥；埃里克森京东方；拉跨世纪东方；lakjsd.lkf啊；了',
            submitPerson: '李思思',
            submitTime: '2024-12-24',
            imgList: [],
            replyList: [
                {
                    id: 121,
                    replyTime: '2024-12-24',
                    content: '看见；老师的空间发；徕卡就立刻加入；考拉我就；收到了放假啊看我家',
                },
                {
                    id: 123465,
                    replyTime: '2024-12-25',
                    content: '看见；老师的空间发；徕卡就立刻加入；考拉我就；收到了放假啊看我家',
                },
            ],
        },
    })
}

/**
 * 回复在线咨询
 * @param query
 * @returns
 */
export function replyOnlineConsultation(query: reply) {
    console.log(query)
    return Promise.resolve({
        data: 'success',
    })
}
