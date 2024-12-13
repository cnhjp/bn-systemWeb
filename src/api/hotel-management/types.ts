/**
 * 酒店管理--列表
 */
export interface HotelListResponse {
    data: {
        total: number
        rows: item[]
    }
}

/**
 * 酒店管理--列表row
 */
export class item {
    id: number
    name: string
    contact: number
    address: string

    constructor() {
        this.id = 0
        this.name = ''
        this.contact = 0
        this.address = ''
    }
}

/**
 * 酒店管理--表单项
 */
export interface HotelForm {
    id: number
    name: string
    contact: number | null
    address: string
    introduction: string
    docName: string
    docId: number
    docPath: string
}
