declare namespace AuthRoute {
    interface RouteMeta extends Record<string, any> {
        title: string
        allowAnonymous?: boolean
    }

    type Route = {
        /** 路由描述 */
        meta: RouteMeta
        /** 子路由 */
        children?: Route[]
    } & Omit<VueRoute, 'meta', 'children'>

    type VueRoute = import('vue-router').RouteRecordRaw

    type RouteName = import('vue-router').RouteRecordName | null | undefined

    type RouteModule = Record<string, { default: Route }>
}
