import { BasicLayout } from '@/layout'

const routes: AuthRoute.Route = [
    {
        path: 'bus-manage',
        name: 'bus-manage',
        component: () => import('@/views/meeting-manage/bus-manage/bus-manage.vue'),
        meta: { title: '班车管理' },
    },
]

export default {
    path: '/meeting-manage',
    name: 'meeting-manage-root',
    redirect: { name: 'bus-manage' },
    component: BasicLayout,
    children: routes,
}
