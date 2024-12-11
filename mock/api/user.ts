import { type MockMethod } from 'vite-plugin-mock'
import { httpMock } from '../helper'

const apis: MockMethod[] = [
    httpMock.post('/user/login', ({ body }) => {
        const { username, password } = body
        if (username === 'admin' && password === '111111') {
            return { token: 'javis_token' }
        }
        throw new Error('用户名或密码错误')
    }),
    httpMock.getAuth('/user/info', (_ctx, _mock) => {
        return {
            userId: 1,
            userName: 'javis',
            userRole: 'admin',
        }
    }),
    httpMock.getAuth('/user/menus', () => {
        return [
            { id: 100, title: '首页', route: 'home', icon: 'cast' },
            {
                id: 200,
                title: '议案建议',
                route: 'proposal',
                icon: 'cast',
                children: [
                    { id: 201, title: '建议登记', route: 'advice-register', icon: 'cast' },
                    { id: 202, title: '议案登记', route: 'motion-register', icon: 'cast' },
                    { id: 203, title: '建议案查询', route: 'proposal-search', icon: 'cast' },
                ],
            },
            {
                id: 300,
                title: '代表管理',
                route: 'deputy',
                icon: 'cast',
                children: [
                    { id: 301, title: '代表信息查询', route: 'deputy-search', icon: 'cast' },
                    { id: 302, title: '代表信息统计', route: 'deputy-statistics', icon: 'cast' },
                    { id: 303, title: '代表变动记录', route: 'deputy-record', icon: 'cast' },
                ],
            },
            {
                id: 400,
                title: '基础支撑',
                route: 'support',
                icon: 'cast',
                children: [
                    { id: 401, title: '区域管理', route: 'support-area', icon: 'cast' },
                    { id: 402, title: '届次管理', route: 'support-term', icon: 'cast' },
                    { id: 403, title: '系统日志', route: 'support-logger', icon: 'cast' },
                ],
            },
        ]
    }),
]

export default apis
