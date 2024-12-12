import { defineStore } from 'pinia'
import { constantRoutes, routes as staticRoutes, resetRouter, router, ERROR_ROUTES, routeName } from '@/router'
import { type RouteLocationRaw } from 'vue-router'
import { fetchUserMenus } from '@/api/user/user.ts'
import { getConstantRouteNames, transformDataToMenu, transformMenuToRoute } from '@/utils'

type RouteMode = 'static' | 'dynamic'

interface RouteStoreState {
    routeMode: RouteMode
    filtMenus: App.GlobalMenuOption[]
    deepRoutes: AuthRoute.Route[]
    flatRoutes: AuthRoute.Route[]
    cacheRoutes: string[]
    isInitRoute: boolean
}

export const useRouteStore = defineStore('route-store', {
    state: (): RouteStoreState => ({
        routeMode: 'dynamic',
        filtMenus: [],
        deepRoutes: [],
        flatRoutes: [],
        cacheRoutes: [],
        isInitRoute: false,
    }),
    actions: {
        /** 初始权限路由 */
        async initAuthRoute() {
            if (this.routeMode === 'static') {
                await this.initStaticRoute()
            }
            if (this.routeMode === 'dynamic') {
                await this.initDynamicRoute()
            }
        },
        /** 初始静态路由 */
        async initStaticRoute() {
            this.deepRoutes = staticRoutes
            this.flatRoutes = resetRouter(this.deepRoutes)
            this.isInitRoute = true
        },
        /** 初始动态路由 */
        async initDynamicRoute() {
            const { data } = await fetchUserMenus()
            const menus = transformDataToMenu(data)
            const routes = transformMenuToRoute(menus)
            this.filtMenus = menus
            this.deepRoutes = routes
            this.flatRoutes = resetRouter(routes)
            this.isInitRoute = true
        },
        /** 是否异常路由 */
        isValidErrorRoute(name: AuthRoute.RouteName) {
            const errorRoutes = getConstantRouteNames(ERROR_ROUTES)
            return errorRoutes.includes(name)
        },
        /** 是否固定路由 */
        isValidConstantRoute(name: AuthRoute.RouteName) {
            const NOT_FOUND_PAGE_NAME = 'not-found'
            const constantRouteNames = getConstantRouteNames(constantRoutes)
            return constantRouteNames.includes(name) && name !== NOT_FOUND_PAGE_NAME
        },
        /** 路由是否存在 */
        existsRoute(name: string) {
            const routes = router.getRoutes()
            return routes.some((route) => route.name === name)
        },
        routerPush(to: RouteLocationRaw, newTab = false) {
            if (newTab) {
                const routerData = router.resolve(to)
                window.open(routerData.href, '_blank')
                return Promise.resolve()
            }
            return router.push(to)
        },
        loginToRedirect() {
            const { query } = router.currentRoute.value
            if (query?.redirect) {
                this.routerPush(query.redirect as string)
            } else {
                this.routerPush({ name: routeName('root') })
            }
        },
        redirectToLogin(useRedirect: boolean = false, redirectUrl?: string) {
            const route = router.currentRoute.value
            const location: RouteLocationRaw = {
                name: routeName('login'),
            }
            if (useRedirect) {
                location.query = { redirect: redirectUrl || route.fullPath }
            }
            this.routerPush(location)
        },
        resetRouteStore() {
            this.$reset()
        },
    },
})
