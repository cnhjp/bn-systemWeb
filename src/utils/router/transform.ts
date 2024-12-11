import { routes as staticRoutes } from '@/router'

export function transformAuthRouteToVueRoutes(routes: AuthRoute.Route[]): AuthRoute.VueRoute[] {
    return routes.map((route) => transformAuthRouteToVueRoute(route)) as any
}

export function transformAuthRouteToVueRoute(route: AuthRoute.Route): AuthRoute.VueRoute {
    return route as any
}

export function transformDataToMenu<T extends Recordable>(array: T[]): App.GlobalMenuOption[] {
    const globalMenu: App.GlobalMenuOption[] = []
    array.forEach((data) => {
        let menuChild: any[] | undefined
        if (data.children && data.children.length > 0) {
            menuChild = transformDataToMenu(data.children)
        }
        const menuItem: App.GlobalMenuOption = {
            key: data.id,
            label: data.title,
            index: data.route,
            icon: data.icon,
            children: menuChild,
        }
        globalMenu.push(menuItem)
    })
    return globalMenu
}

export function transformMenuToRoute(menus: App.GlobalMenuOption[]): AuthRoute.Route[] {
    const globalRoutes: AuthRoute.Route[] = []
    const filterEnabledRoute = (menus: App.GlobalMenuOption[]) => {
        menus.forEach((menu) => {
            const enabledRoute = findEnabledRoute(menu)
            if (enabledRoute && !globalRoutes.some((route) => route.name === enabledRoute.name)) {
                globalRoutes.push(enabledRoute)
            }
            if (menu.children && menu.children.length > 0) {
                filterEnabledRoute(menu.children)
            }
        })
    }

    return filterEnabledRoute(menus), globalRoutes
}

function findEnabledRoute(menu: App.GlobalMenuOption) {
    const existRoute = (route: AuthRoute.Route): boolean => {
        if (route.name === menu.index) {
            return true
        }
        if (route.children && route.children.length > 0) {
            return route.children.some(existRoute)
        }
        return false
    }

    return staticRoutes.find(existRoute)
}

function renderPartialProps() {}
