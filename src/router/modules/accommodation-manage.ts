import { BasicLayout } from '@/layout'

const routes: AuthRoute.Route = [
    {
        path: 'list',
        name: 'accommodation-manage-list',
        component: () => import('@/views/accommodation-manage/accommodation-manage.vue'),
        meta: { title: '住宿管理' },
    },
]

export default {
    path: '/accommodation-manage',
    name: 'accommodation-manage',
    redirect: { name: 'accommodation-manage' },
    component: BasicLayout,
    children: routes,
}
