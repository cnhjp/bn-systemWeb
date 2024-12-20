import { BasicLayout } from '@/layout'

const routes: AuthRoute.Route = [
    {
        path: 'list',
        name: 'meal-manage-list',
        component: () => import('@/views/meal-manage/meal-manage.vue'),
        meta: { title: '用餐管理' },
    },
    {
        path: 'address',
        name: 'meal-manage-address',
        component: () => import('@/views/meal-manage/meal-address.vue'),
        meta: { title: '用餐地点' },
    },
]

export default {
    path: '/meal-manage',
    name: 'meal-manage',
    redirect: { name: 'meal-manage' },
    component: BasicLayout,
    children: routes,
}
