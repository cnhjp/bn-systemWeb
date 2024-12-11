import { BasicLayout } from '@/layout'
import { views } from '@/views'

const routes: AuthRoute.Route = [
    {
        path: 'advice/register',
        name: 'advice-register',
        component: views.advice_register,
        meta: { title: '建议登记' },
    },
    {
        path: 'motion/register',
        name: 'motion-register',
        component: views.motion_register,
        meta: { title: '议案登记' },
    },
    {
        path: 'search',
        name: 'proposal-search',
        component: views.proposal_search,
        meta: { title: '建议案查询' },
    },
    {
        path: 'detail/:id',
        name: 'proposal-detail',
        component: views.proposal_detail,
        meta: { title: '建议案详情' },
    },
]

export default {
    path: '/proposal',
    name: 'proposal-root',
    redirect: { name: 'root' },
    component: BasicLayout,
    children: routes,
}
