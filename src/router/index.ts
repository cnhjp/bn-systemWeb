import type { App } from 'vue'
import { createRouter, createWebHistory, type Router } from 'vue-router'
import { createRouterGuard } from './guard'
import { overrideRouterCapture } from './override'
// import { transformAuthRouteToVueRoutes } from '@/utils'
import { constantRoutes } from './routes'

export const buildRouter = (routes: AuthRoute.Route[]): Router => {
    return createRouter({
        history: createWebHistory('/'),
        // routes: transformAuthRouteToVueRoutes(constRoutes),
        // routes: transformAuthRouteToVueRoutes([...constantRoutes, ...routes]),
        routes: [...constantRoutes, ...routes],
        scrollBehavior(to, from, savedPosition) {
            return { left: 0, top: 0 }
        },
    })
}
export const resetRouter = (routes: AuthRoute.Route[]): AuthRoute.Route[] => {
    router.getRoutes().forEach((route) => {
        const { name } = route
        if (name && true) {
            router.hasRoute(name) && router.removeRoute(name)
        }
    })

    const dynamicRoutes = [...constantRoutes, ...routes]
    dynamicRoutes.forEach((route) => {
        router.addRoute(route)
    })

    return router.getRoutes()
}

export const routeName = (key: string) => key
export const routePath = (key: string) => key

export const router = buildRouter([])

/**
 * 安装vue路由
 * @param app Vue应用对象
 */
export async function setupRouter(app: App) {
    app.use(router)

    createRouterGuard(router)

    overrideRouterCapture(router)

    await router.isReady()

    return router
}

export * from './modules'
export * from './routes'
