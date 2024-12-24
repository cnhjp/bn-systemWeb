import { BasicLayout } from '@/layout'

const routes: AuthRoute.Route = [
    {
        path: 'personnel-manage',
        name: 'personnel-manage',
        component: () => import('@/views/system-setting/personnel-manage.vue'),
        meta: { title: '人员账号' },
    },
    {
        path: 'admin-manage',
        name: 'admin-manage',
        component: () => import('@/views/system-setting/admin-manage.vue'),
        meta: { title: '管理员账号' },
    },
    {
        path: 'params-setting',
        name: 'params-setting',
        component: () => import('@/views/system-setting/params-setting.vue'),
        meta: { title: '参数配置' },
    },
]

export default {
    path: '/system-setting',
    name: 'system-setting-root',
    redirect: { name: 'personnel-manage' },
    component: BasicLayout,
    children: routes,
}
