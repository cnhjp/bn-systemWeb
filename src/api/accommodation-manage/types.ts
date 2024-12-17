/**
 * 下拉
 */
export interface DropResponseData {
    data: DropResponse[]
}

/**
 * 下拉
 */
export interface DropResponse {
    value: string
    label: string
    deep: 0
    selected: true
    order: 0
    relateContent: string
    relateContent2: string
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
