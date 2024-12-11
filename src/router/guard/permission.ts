import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { createDynamicRouteGuard } from './dynamic'
import { useUserStore } from '@/store'
import { exeStrategyActions } from '@/utils'

export async function createPermissionGuard(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext,
) {
    const permission = await createDynamicRouteGuard(to, from, next)
    if (!permission) return

    const userStore = useUserStore()

    if (userStore.isLoggedIn && !userStore.isInitUser) {
        await userStore.initUserStore()
    }

    const actions: Common.StrategyAction[] = [
        /** 未登录状态访问非匿名页时，重定向至登录页 */
        [
            () => {
                return !userStore.isLoggedIn && to.meta.allowAnonymous !== true
            },
            () => {
                const redirect = to.fullPath
                next({ name: 'login', query: { redirect } })
            },
        ],
        [() => true, () => next()],
    ]

    exeStrategyActions(actions)
}
