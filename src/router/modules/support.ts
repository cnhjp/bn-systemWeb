import { BasicLayout } from '@/layout'
import { views } from '@/views'

const routes: AuthRoute.Route = [
    {
        path: 'area',
        name: 'support-area',
        component: views.support_area,
        meta: { title: '区域管理' },
    },
    {
        path: 'term',
        name: 'support-term',
        component: views.support_term,
        meta: { title: '届次管理' },
    },
    {
        path: 'logger',
        name: 'support-logger',
        component: views.support_logger,
        meta: { title: '系统日志' },
    },
]

export default {
    path: '/support',
    name: 'support-root',
    redirect: { name: 'root' },
    component: BasicLayout,
    children: routes,
}
