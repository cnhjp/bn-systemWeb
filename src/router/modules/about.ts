import { BasicLayout } from '@/layout'
import { views } from '@/views'

const routes: AuthRoute.Route = [
    {
        path: '/about',
        name: 'about',
        component: views.about,
        meta: { title: '关于', allowAnonymous: true },
    },
]

export default {
    path: '/about-root',
    name: 'about-root',
    redirect: { name: 'about' },
    component: BasicLayout,
    children: routes,
}
