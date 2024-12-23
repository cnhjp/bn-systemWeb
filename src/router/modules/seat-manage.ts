import { BasicLayout } from '@/layout'
import { views } from '@/views'

const routes: AuthRoute.Route[] = [
    {
        path: '',
        name: 'seat-index',
        component: views.seatIndex,
    },
    {
        path: 'layout',
        name: 'seat-layout',
        component: views.seatLayout,
    },
]

export default {
    path: '/seat',
    name: 'seat-manage',
    redirect: { name: 'seat-main' },
    component: BasicLayout,
    children: routes,
}
