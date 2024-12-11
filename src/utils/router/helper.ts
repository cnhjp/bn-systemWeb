export function getConstantRouteNames(routes: AuthRoute.Route[]) {
    return routes.map((route) => getConstantRouteName(route)).flat(1)
}

export function getConstantRouteName(route: AuthRoute.Route) {
    const names = [route.name]
    if (route.children?.length) {
        names.push(...route.children!.map((item: AuthRoute.Route) => getConstantRouteName(item)).flat(1))
    }
    return names
}
