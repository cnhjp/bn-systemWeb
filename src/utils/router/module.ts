import { TypeAssert } from '../types'

export function sortRoutes(routes: AuthRoute.Route[]) {
    return routes
        .sort((next, pre) => Number(next.meta?.order) - Number(pre.meta?.order))
        .map((i) => {
            if (i.children) sortRoutes(i.children)
            return i
        })
}

export function handleModuleRoutes(modules: AuthRoute.RouteModule) {
    const routes: AuthRoute.Route[] = []

    Object.keys(modules).forEach((key) => {
        let importItem = modules[key].default
        if (TypeAssert.isObject(importItem)) {
            importItem = [importItem]
        }
        if (importItem) {
            routes.push(...importItem)
        } else {
            window.console.error(`路由模块解析出错: key = ${key}`)
        }
    })

    return sortRoutes(routes)
}
