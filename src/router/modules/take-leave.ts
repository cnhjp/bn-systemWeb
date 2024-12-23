import { BasicLayout } from '@/layout'

const routes: AuthRoute.Route = [
    {
        path: 'index',
        name: 'take-leave-list',
        component: () => import('@/views/take-leave/take-leave.vue'),
        meta: { title: '请假管理' },
    },
    {
        path: 'add',
        name: 'take-leave-add',
        component: () => import('@/views/take-leave/take-leave-add.vue'),
        meta: { title: '新增', rootName: 'take-leave-list' },
    },
    {
        path: 'edit',
        name: 'take-leave-edit',
        component: () => import('@/views/take-leave/take-leave-edit.vue'),
        meta: { title: '编辑', rootName: 'take-leave-list' },
    },
    {
        path: 'detail',
        name: 'take-leave-detail',
        component: () => import('@/views/take-leave/take-leave-detail.vue'),
        meta: { title: '详情', rootName: 'take-leave-list' },
    },
]

export default {
    path: '/take-leave',
    name: 'take-leave-root',
    redirect: { name: 'take-leave' },
    component: BasicLayout,
    children: routes,
}
