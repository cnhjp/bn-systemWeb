import { BasicLayout } from '@/layout'

const routes: AuthRoute.Route = [
    {
        path: 'list',
        name: 'hotel-management-list',
        component: import('@/views/hotel-management/hotel-list.vue'),
        meta: { title: '酒店管理' },
    },
]

export default {
    path: '/hotel-management',
    name: 'hotel-management',
    redirect: { name: 'personnel-manage' },
    component: BasicLayout,
    children: routes,
}
