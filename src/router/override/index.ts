import type { Router } from 'vue-router'

export function overrideRouterCapture(router: Router) {
    const originalPush = router.push
    router.push = async function push(...args) {
        try {
            return await originalPush.call(this, ...args)
        } catch (error: any) {
            const location = error.location || {}
            console.error('路由异常-[push]:', JSON.stringify(location))
        }
    }

    const originalReplace = router.replace
    router.replace = async function replace(...args) {
        try {
            return await originalReplace.call(this, ...args)
        } catch (error: any) {
            const location = error.location || {}
            console.error('路由异常-[replace]:', JSON.stringify(location))
        }
    }
}
