import type { Router } from 'vue-router'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import { wrapperEnv } from '@/utils'
import { createPermissionGuard } from './permission'
import { useRouteStore } from '@/store'

nprogress.configure({ showSpinner: false })

export function createRouterGuard(router: Router) {
    router.beforeEach(async (to, from, next) => {
        try {
            nprogress.start()
            const routeStore = useRouteStore()
            if (routeStore.isValidErrorRoute(to.name)) {
                return next()
            }
            await createPermissionGuard(to, from, next)
        } catch (error) {
            next({ name: '500' })
        }
    })

    router.afterEach(async (to, _from, _failure) => {
        const viteEnv = wrapperEnv()
        document.title = (to.meta?.title as string) || viteEnv.VITE_APP_TITLE
        nprogress.done()
    })
}
