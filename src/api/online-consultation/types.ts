/**
 * 在线咨询--列表
 */
export interface OnlineConsultationListResponse {
    total: number
    rows: item[]
}

/**
 * 在线咨询--列表row
 */
export class item {
    id: number
    name: string
    problem: string
    status: number

    constructor() {
        this.id = 0
        this.name = ''
        this.problem = ''
        this.status = 0
    }
}

/**
 * 在线咨询--详情
 */
export interface OnlineConsultationDetail {
    id: number
    title: string
    content: string
    submitPerson: string
    submitTime: string
    imgList: imgItem[]
    replyList: replyItem[]
}

/**
 * 在线咨询--详情--回复row
 */
export class replyItem {
    id: number
    replyTime: string
    content: string

    constructor() {
        this.id = 0
        this.replyTime = ''
        this.content = ''
    }
}

/**
 * 在线咨询--详情--图片row
 */
export class imgItem {
    imgId: number
    imgName: string
    imgPath: string

    constructor() {
        this.imgId = 0
        this.imgName = ''
        this.imgPath = ''
    }
}

/**
 * 在线咨询--详情
 */
export interface reply {
    id: number
    replyContent: string
}
