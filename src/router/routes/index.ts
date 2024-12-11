import { BlankLayout, BasicLayout } from '@/layout'
import { views } from '@/views'

export const ROOT_ROUTE: AuthRoute.Route = {
    path: '/',
    name: 'root',
    meta: { title: '' },
    redirect: { name: 'home' },
}
export const ERROR_ROUTES: AuthRoute.Route[] = [
    {
        path: '/403',
        name: '403',
        component: views.error_403,
        meta: { title: '禁止访问', allowAnonymous: true },
    },
    {
        path: '/404',
        name: '404',
        component: views.error_404,
        meta: { title: '未找到资源', allowAnonymous: true },
    },
    {
        path: '/500',
        name: '500',
        component: views.error_500,
        meta: { title: '服务器内部错误', allowAnonymous: true },
    },
    {
        path: '/no-network',
        name: 'no-network',
        component: views.error_500,
        meta: { title: '暂无网络', allowAnonymous: true },
    },
]
export const NOTFOUND_ROUTES: AuthRoute.Route[] = [
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: views.notFound,
        meta: { title: '未找到视图', allowAnonymous: true },
    },
]

export const constantRoutes: AuthRoute.Route[] = [
    ROOT_ROUTE,
    {
        path: '/builtin',
        name: 'builtin',
        meta: { title: '' },
        redirect: { name: 'not-found' },
        component: BlankLayout,
        children: [
            {
                path: '/login',
                name: 'login',
                component: views.login,
                meta: { title: '登陆', allowAnonymous: true },
            },
            ...ERROR_ROUTES,
            ...NOTFOUND_ROUTES,
        ],
    },
    {
        path: '/basic-layout',
        name: 'basic-layout',
        meta: { title: '' },
        component: BasicLayout,
        children: [
            {
                path: '/',
                name: 'home',
                meta: { title: '首页' },
                component: views.home,
            },
        ],
    },
]
