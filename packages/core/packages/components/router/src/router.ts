import {clone} from '@packages/components/core'
import type {RouteRecordRaise, RouteRecordRaiseFn, RouteChildrenRaiseFn} from './token'

/**
 * 映射路由对象
 * @param source 来源对象
 */
function cloneRoute(source: RouteRecordRaise): RouteRecordRaise {
    const target: any = {}
    if (source.name) target.name = clone(source.name)
    if (source.path) target.path = clone(source.path)
    if (source.meta) target.meta = clone(source.meta)
    if (source.alias) target.alias = clone(source.alias)
    if (source.redirect) target.redirect = clone(source.redirect)
    if (source.component) target.component = source.component
    return target
}

/**
 * 路由工厂
 */
export class RouterFactory {
    private readonly routes: RouteRecordRaise[]
    private readonly raiseRoute: (route: RouteRecordRaise, routes: RouteRecordRaise[]) => void
    private readonly raiseChild: (child: RouteRecordRaise[], parent: RouteRecordRaise) => void
    private readonly emptyRoute: any

    constructor(routes: RouteRecordRaise[], raiseRoute: RouteRecordRaiseFn, raiseChild: RouteChildrenRaiseFn, emptyRoute: any) {
        this.routes = routes || []
        this.raiseRoute = raiseRoute || new Function()
        this.raiseChild = raiseChild || new Function()
        this.emptyRoute = emptyRoute
    }

    /**
     * 注册路由
     * @param route 路由对象
     */
    public register(route: RouteRecordRaise | RouteRecordRaise[]): RouterFactory {
        if (route instanceof Array) {
            route.map(r => this.recursive(r, this.routes))
        } else {
            this.recursive(route, this.routes)
        }
        return this
    }

    /**
     * 递归注册
     * @param route 路由对象
     * @param routes 路由集合
     */
    private recursive(route: RouteRecordRaise, routes: RouteRecordRaise[]) {
        const newRoute = cloneRoute(route)
        this.raiseRoute(newRoute, routes)
        routes.push(newRoute)
        if (route.route) {
            const redirectRoute = cloneRoute(newRoute)
            newRoute.redirect = {name: redirectRoute.name}
            newRoute.component = this.emptyRoute
            routes.push(redirectRoute)
            delete newRoute.name
        }
        if (route.children instanceof Array && route.children.length > 0) {
            const children: RouteRecordRaise[] = newRoute.children = []
            route.children.map((item: RouteRecordRaise) => {
                return this.recursive(item, children)
            })
            this.raiseChild(children, newRoute)
        }
    }

    /**
     * 指定路由对象是否存在
     * @param target 路由对象
     * @param prop 比对属性
     */
    public exists(target: RouteRecordRaise, prop: string) {
        const predicate = (route: RouteRecordRaise): boolean => {
            if (route[prop] === target[prop])
                return true
            if (route.children instanceof Array && route.children.length > 0)
                return route.children.some(predicate)
            return false
        }
        return this.routes.some(predicate)
    }

    /**
     * 清理路由集合
     */
    public clean() {
        this.routes.splice(0, this.routes.length)
        return this
    }
}
