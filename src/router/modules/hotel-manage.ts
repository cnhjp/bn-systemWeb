import { BasicLayout } from '@/layout'

const routes: AuthRoute.Route = [
    {
        path: 'list',
        name: 'hotel-manage-list',
        component: import('@/views/hotel-manage/hotel-list.vue'),
        meta: { title: '酒店管理' },
    },
    {
        path: 'add',
        name: 'hotel-manage-add',
        component: import('@/views/hotel-manage/hotel-add.vue'),
        meta: { title: '添加酒店' },
    },
    {
        path: 'edit',
        name: 'hotel-manage-edit',
        component: import('@/views/hotel-manage/hotel-edit.vue'),
        meta: { title: '编辑酒店' },
    },
]

export default {
    path: '/hotel-manage',
    name: 'hotel-manage',
    redirect: { name: 'hotel-manage' },
    component: BasicLayout,
    children: routes,
}
