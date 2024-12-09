import type { RouteRecordRaise, RouteRecordRaiseFn, RouteChildrenRaiseFn } from './token';
/**
 * 路由工厂
 */
export declare class RouterFactory {
    private readonly routes;
    private readonly raiseRoute;
    private readonly raiseChild;
    private readonly emptyRoute;
    constructor(routes: RouteRecordRaise[], raiseRoute: RouteRecordRaiseFn, raiseChild: RouteChildrenRaiseFn, emptyRoute: any);
    /**
     * 注册路由
     * @param route 路由对象
     */
    register(route: RouteRecordRaise | RouteRecordRaise[]): RouterFactory;
    /**
     * 递归注册
     * @param route 路由对象
     * @param routes 路由集合
     */
    private recursive;
    /**
     * 指定路由对象是否存在
     * @param target 路由对象
     * @param prop 比对属性
     */
    exists(target: RouteRecordRaise, prop: string): boolean;
    /**
     * 清理路由集合
     */
    clean(): this;
}
