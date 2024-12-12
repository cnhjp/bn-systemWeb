import { http } from '@/utils/http'
import type { LoginByUserRequest, LoginResponse } from './types'

export function fetchLogin(data: LoginByUserRequest) {
    return http.post<LoginByUserRequest, LoginResponse>('/api/login/token', data)
}

export function fetchUserInfo() {
    // return http.get('/user/info')
    return Promise.resolve({
        data: {
            userId: 1,
            userName: 'javis',
            userRole: 'admin',
        },
    })
}

export function fetchUserMenus() {
    // return http.get('/user/menus')
    return Promise.resolve({
        data: [
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
            {
                id: 500,
                title: '系统设置',
                route: 'system-setting',
                icon: 'cast',
                children: [
                    { id: 501, title: '人员管理', route: 'personnel-manage', icon: 'cast' },
                    { id: 502, title: '参数配置', route: 'params-setting', icon: 'cast' },
                ],
            },
        ],
    })
}
