import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { routeName } from '@/router'
import { useUserStore, useRouteStore } from '@/store'

export async function createDynamicRouteGuard(
    to: RouteLocationNormalized,
    _from: RouteLocationNormalized,
    next: NavigationGuardNext,
) {
    const userStore = useUserStore()
    const routeStore = useRouteStore()

    /** 初始化权限路由 */
    if (!routeStore.isInitRoute) {
        /** 未登录情况下返回登录页 */
        if (!userStore.isLoggedIn) {
            if (routeStore.isValidConstantRoute(to.name) && to.meta?.allowAnonymous) {
                next()
            } else {
                const redirect = to.fullPath
                next({ name: routeName('login'), query: { redirect } })
            }
            return false
        }

        await routeStore.initAuthRoute()

        /** 未初始化权限路由之前，默认定向到 not-found 视图，需要在初始化后重定向 */
        if (routeName(to.name as string) === routeName('not-found')) {
            const path = to.redirectedFrom?.name === 'root' ? '/' : to.fullPath
            next({ path, replace: true, query: to.query, hash: to.hash })
            return false
        }
    }

    /** 权限路由已经加载，仍然未找到，重定向到404 */
    if (to.name === routeName('not-found')) {
        // next({ name: routeName('404'), replace: true })
        next()
        return false
    }

    return true
}
