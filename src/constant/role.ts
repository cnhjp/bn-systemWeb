export enum ROLE_VALUE {
    // 出席人员1
    ATTENDEE = 1,
    // 列席人员2
    LISTENER = 2,
    // 服务终端4
    SERVICE = 4,
    // 投影大屏7
    PROJECTOR = 7,
    // 侯会大厅8
    HALL = 8,
    // 后勤人员9
    POST = 9,
    // 主持终端10
    HOST = 10,
    // 工作人员11
    WORKER = 11,
}

export const ROLE_MAP = {
    [ROLE_VALUE.ATTENDEE]: '出席人员',
    [ROLE_VALUE.LISTENER]: '列席人员',
    [ROLE_VALUE.SERVICE]: '服务终端',
    [ROLE_VALUE.PROJECTOR]: '投影大屏',
    [ROLE_VALUE.HALL]: '侯会大厅',
    [ROLE_VALUE.POST]: '后勤人员',
    [ROLE_VALUE.HOST]: '主持终端',
    [ROLE_VALUE.WORKER]: '工作人员',
}
