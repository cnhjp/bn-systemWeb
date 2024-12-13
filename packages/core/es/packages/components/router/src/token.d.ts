import type { RouteRecordRaw, RouteMeta } from 'vue-router';
/**
 * 路由单体对象
 */
declare interface RouteRecordSimple extends Record<string, unknown> {
    /**
     * 是否开启扁平化路由
     */
    route?: boolean;
    /**
     * 路由标签对象
     */
    meta: RouteMetaRaise;
    children?: RouteRecordRaise[];
}
/**
 * 强化路由对象
 */
export declare type RouteRecordRaise = RouteRecordRaw & RouteRecordSimple;
/**
 * 强化路由标签对象
 */
export declare interface RouteMetaRaise extends RouteMeta {
    title: string;
    oauth: boolean;
    allowAnonymous: boolean;
}
export declare interface RouteRecordRaiseFn {
    (route: RouteRecordSimple, routes: RouteRecordSimple[]): void;
}
export declare interface RouteChildrenRaiseFn {
    (child: RouteRecordSimple[], parent: RouteRecordSimple): void;
}
export {};
