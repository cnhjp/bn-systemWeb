// import { http } from '~/src/utils/http'

// 签到状态
export function dropDownAttendanceStatus() {
    //return http.get('/api/convention/type')
    return Promise.resolve({
        data: [
            {
                label: '已签',
                value: 1,
            },
            {
                label: '未签',
                value: 2,
            },
            {
                label: '请假',
                value: 3,
            },
        ],
    })
}

// 签到列表
export function getAttendPage(query: any) {
    //return http.get('/api/convention/type')
    console.log(query)
    return Promise.resolve({
        data: {
            total: 3,
            rows: [
                {
                    name: '李建国',
                    status: 1,
                },
                {
                    name: '张建军',
                    status: 2,
                },
                {
                    name: '方圆',
                    status: 3,
                },
            ],
        },
    })
}
