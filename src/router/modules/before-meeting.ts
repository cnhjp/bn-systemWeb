import { BasicLayout } from '@/layout'

const routes: AuthRoute.Route = [
    {
        path: 'info',
        name: 'before-meeting-info',
        component: () => import('@/views/before-meeting/info.vue'),
        meta: { title: '会议信息' },
    },
    {
        path: 'info/group',
        name: 'before-meeting-info-group',
        component: () => import('@/views/before-meeting/group.vue'),
        meta: { title: '会议信息', rootName: 'before-meeting-info' },
    },

    {
        path: 'info/add',
        name: 'before-meeting-info-add',
        component: () => import('@/views/before-meeting/info-add.vue'),
        meta: { title: '新增', rootName: 'before-meeting-info' },
    },
    {
        path: 'info/edit',
        name: 'before-meeting-info-edit',
        component: () => import('@/views/before-meeting/info-edit.vue'),
        meta: { title: '编辑', rootName: 'before-meeting-info' },
    },
    {
        path: 'info/type-setting',
        name: 'before-meeting-info-type-setting',
        component: () => import('@/views/before-meeting/type-setting.vue'),
        meta: { title: '类型配置', rootName: 'before-meeting-info' },
    },
    {
        path: 'info/emblem',
        name: 'before-meeting-info-emblem',
        component: () => import('@/views/before-meeting/emblem.vue'),
        meta: { title: '会议会徽', rootName: 'before-meeting-info' },
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
