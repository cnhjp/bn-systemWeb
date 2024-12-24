import { BasicLayout } from '@/layout'

const routes: AuthRoute.Route = [
    {
        path: 'activity',
        name: 'news-convention-activity',
        component: () => import('@/views/news-manage/news-convention-activity.vue'),
        meta: { title: '大会活动' },
    },
    {
        path: 'brief',
        name: 'news-convention-brief',
        component: () => import('@/views/news-manage/news-convention-brief.vue'),
        meta: { title: '大会简报' },
    },
    {
        path: 'add',
        name: 'news-manage-add',
        component: () => import('@/views/news-manage/news-add.vue'),
        meta: { title: '添加', rootName: '' },
    },
    {
        path: 'edit',
        name: 'news-manage-edit',
        component: () => import('@/views/news-manage/news-edit.vue'),
        meta: { title: '编辑', rootName: '' },
    },
    {
        path: 'detail',
        name: 'news-manage-detail',
        component: () => import('@/views/news-manage/news-detail.vue'),
        meta: { title: '详情', rootName: '' },
    },
]

export default {
    path: '/news-manage',
    name: 'news-manage-root',
    redirect: { name: 'bus-manage' },
    component: BasicLayout,
    children: routes,
}
