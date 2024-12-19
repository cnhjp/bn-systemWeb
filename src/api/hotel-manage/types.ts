/**
 * 酒店管理--列表
 */
export interface HotelListResponse {
    total: number
    rows: item[]
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
    hotelID: number
    tenantID: number
    conventionID: number
    hotelName: string
    hotelAddress: string
    hotelContact: string
    hotelRemark: string
    files: file[]
}

export class file {
    docName: string
    docId: number
    docPath: string

    constructor() {
        this.docId = 0
        this.docName = ''
        this.docPath = ''
    }
}
