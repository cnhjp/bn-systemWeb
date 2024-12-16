import { BasicLayout } from '@/layout'

const routes: AuthRoute.Route = [
    {
        path: 'list',
        name: 'online-consultation-list',
        component: () => import('@/views/online-consultation/online-consultation.vue'),
        meta: { title: '在线咨询' },
    },
    {
        path: 'detail',
        name: 'online-consultation-detail',
        component: () => import('@/views/online-consultation/online-consultation-detail.vue'),
        meta: { title: '在线咨询详情' },
    },
]

export default {
    path: '/online-consultation',
    name: 'online-consultation',
    redirect: { name: 'online-consultation' },
    component: BasicLayout,
    children: routes,
}
