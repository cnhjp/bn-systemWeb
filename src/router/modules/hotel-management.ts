import { BasicLayout } from '@/layout'

const routes: AuthRoute.Route = [
    {
        path: 'list',
        name: 'hotel-management-list',
        component: import('@/views/hotel-management/hotel-list.vue'),
        meta: { title: '酒店管理' },
    },
    {
        path: 'add',
        name: 'hotel-management-add',
        component: import('@/views/hotel-management/hotel-add.vue'),
        meta: { title: '添加酒店' },
    },
    {
        path: 'edit',
        name: 'hotel-management-edit',
        component: import('@/views/hotel-management/hotel-edit.vue'),
        meta: { title: '编辑酒店' },
    },
]

export default {
    path: '/hotel-management',
    name: 'hotel-management',
    redirect: { name: 'personnel-manage' },
    component: BasicLayout,
    children: routes,
}
