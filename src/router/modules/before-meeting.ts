import { BasicLayout } from '@/layout'

const routes: AuthRoute.Route = [
    {
        path: 'info',
        name: 'before-meeting-info',
        component: () => import('@/views/before-meeting/info.vue'),
        meta: { title: '会议信息' },
    },
    {
        path: 'personnel',
        name: 'before-meeting-personnel',
        component: () => import('@/views/before-meeting/personnel.vue'),
        meta: { title: '会议人员' },
    },
    {
        path: 'material',
        name: 'before-meeting-material',
        component: () => import('@/views/before-meeting/material.vue'),
        meta: { title: '会议材料' },
    },
    {
        path: 'material/category',
        name: 'before-meeting-material-category',
        component: () => import('@/views/before-meeting/category.vue'),
        meta: { title: '分类管理', rootName: 'before-meeting-material' },
    },
]

export default {
    path: '/before-meeting',
    name: 'before-meeting-root',
    redirect: { name: 'before-meeting-info' },
    component: BasicLayout,
    children: routes,
}
