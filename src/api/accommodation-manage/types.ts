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
    value: number
    label: string
    deep: 0
    selected: true
    order: 0
    relateContent: string
    relateContent2: string
}

/**
 * 新增住宿--表单项
 */
export interface roomFormResponse {
    data: roomForm
}

/**
 * 新增住宿--表单项
 */
export interface roomForm {
    conventionId: number | null
    hotelId: number | null
    hotelName: string
    hotelRoomId: number | null
    roomNumber: string
    roomType: number | null
    sortIndex: number | null
    personList: personItem[]
}

/**
 * 新增住宿--人员row
 */
export class personItem {
    hotelRoomId: number | null
    hotelRoomPersonId: number | null
    personId: number | null
    personName: string
    sexStr: string

    constructor() {
        this.hotelRoomId = 0
        this.hotelRoomPersonId = 0
        this.personId = 0
        this.personName = ''
        this.sexStr = ''
    }
}
