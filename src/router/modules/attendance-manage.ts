import { BasicLayout } from '@/layout'

const routes: AuthRoute.Route = [
    {
        path: 'list',
        name: 'attendance-manage-list',
        component: () => import('@/views/attendance-manage/attendance-manage.vue'),
        meta: { title: '签到管理' },
    },
]

export default {
    path: '/attendance-manage',
    name: 'attendance-manage',
    redirect: { name: 'attendance-manage' },
    component: BasicLayout,
    children: routes,
}
