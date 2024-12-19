import { BasicLayout } from '@/layout'

const routes: AuthRoute.Route = [
    {
        path: 'index',
        name: 'notice-list',
        component: () => import('@/views/notice/notice.vue'),
        meta: { title: '通知公告' },
    },
    {
        path: 'add',
        name: 'notice-add',
        component: () => import('@/views/notice/notice-add.vue'),
        meta: { title: '新增', rootName: 'notice-list' },
    },
    {
        path: 'edit',
        name: 'notice-edit',
        component: () => import('@/views/notice/notice-edit.vue'),
        meta: { title: '编辑', rootName: 'notice-list' },
    },
    {
        path: 'detail',
        name: 'notice-detail',
        component: () => import('@/views/notice/notice-detail.vue'),
        meta: { title: '详情', rootName: 'notice-list' },
    },
]

export default {
    path: '/notice',
    name: 'notice-root',
    redirect: { name: 'notice' },
    component: BasicLayout,
    children: routes,
}
