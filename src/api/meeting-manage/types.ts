/**
 * 会议室类型
 */
export enum ROOM_TYPE {
    UNKNOWN = 0,
    PUBLISH, //公用
    COMMON, // 大会议室
    STEP, //阶梯议室
    OTHER, //其他
}

/**
 * 会议室状态
 */
export enum ROOM_STATUS {
    UNKNOWN = 0,
    AVAILABLE, //可用
    DEPRECATED, // 弃用
    OTHER, //维护中
}

/**
 * 场地类型
 */
export enum VENUE_TYPE {
    UNKNOWN = 0,
    ROUND, //圆形
    USHAPED, //马蹄形
    SQUARE, //方形
    OUTSIDE, //户外
    OTHER, //其他
}
