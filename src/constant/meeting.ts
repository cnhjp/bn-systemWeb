export enum AGENDA_VALUE {
    // 签到1
    SIGN_IN = 1,
    // 议程议题2
    AGENDA = 2,
    // 汇报发言3
    REPORT = 3,
    // 语音播报4
    VOICE_BROADCAST = 4,
    // 单项表决/测评5
    VOTE = 5,
    // 批量表决/评测6
    BATCH_VOTE = 6,
    // 部门分组评测7
    DEPT_VOTE = 7,
    // 差额评选8
    EXCESS_VOTE = 8,
    // 评审评分9
    REVIEW_VOTE = 9,
    // 人事专题10
    PERSONAL_VOTE = 10,
    // 宣誓标语11
    OATH = 11,
    // 签字投票12
    SIGN_VOTE = 12,
}

export const AGENDA_MAP = {
    [AGENDA_VALUE.SIGN_IN]: '签到',
    [AGENDA_VALUE.AGENDA]: '议程议题',
    [AGENDA_VALUE.REPORT]: '汇报发言',
    [AGENDA_VALUE.VOICE_BROADCAST]: '语音播报',
    [AGENDA_VALUE.VOTE]: '单项表决/测评',
    [AGENDA_VALUE.BATCH_VOTE]: '批量表决/评测',
    [AGENDA_VALUE.DEPT_VOTE]: '部门分组评测',
    [AGENDA_VALUE.EXCESS_VOTE]: '差额评选',
    [AGENDA_VALUE.REVIEW_VOTE]: '评审评分',
    [AGENDA_VALUE.PERSONAL_VOTE]: '人事专题',
    [AGENDA_VALUE.OATH]: '宣誓标语',
    [AGENDA_VALUE.SIGN_VOTE]: '签字投票',
}
