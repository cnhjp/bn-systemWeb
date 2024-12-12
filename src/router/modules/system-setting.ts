import { BasicLayout } from '@/layout'
import { views } from '@/views'

const routes: AuthRoute.Route = [
    {
        path: 'personnel-manage',
        name: 'personnel-manage',
        component: views.personnel_manage,
        meta: { title: '人员账号' },
    },
    {
        path: 'params-setting',
        name: 'params-setting',
        component: views.params_setting,
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
