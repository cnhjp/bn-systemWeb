import { BasicLayout } from '@/layout'

const routes: AuthRoute.Route = [
    {
        path: 'list',
        name: 'satisfaction-survey-list',
        component: () => import('@/views/satisfaction-survey/satisfaction-survey-list.vue'),
        meta: { title: '满意度评价' },
    },
]

export default {
    path: '/satisfaction-survey',
    name: 'satisfaction-survey',
    redirect: { name: 'satisfaction-survey' },
    component: BasicLayout,
    children: routes,
}
