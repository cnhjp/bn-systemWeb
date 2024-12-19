declare module '~icons/*'

declare type Recordable<T = any> = Record<string, T>

declare interface Window {
    $store?: any
    $app: any
}

declare module '@package/core' {
    export const Application: any
    export const UserAgent: any
}

declare module '@package/b-grid' {
    export const BGrid: any
}

declare interface ImportMeta {
    env: Recordable<string>
}

declare interface ImportMetaEnv {
    /** 系统版本 */
    readonly VIEW_VERSION: string
    /** 访问端口 */
    readonly VITE_PORT: number
    /** 打开浏览器 */
    readonly VITE_OPEN: boolean
    /** 是否开启打包文件大小结果分析 */
    readonly VITE_VISUALIZER: boolean
    /** 是否开启打包压缩 */
    readonly VITE_COMPRESS: boolean
    /** 清除Console及Debugger */
    readonly VITE_DROP_CONSOLE: boolean

    /** 路由根 */
    readonly VITE_BASE_URL: string
    /** 应用名称 */
    readonly VITE_APP_NAME: string
    /** 应用标题 */
    readonly VITE_APP_TITLE: string
    /** 服务接口 */
    readonly VITE_SERVER_API: string

    /** svg 图标前缀 */
    readonly VITE_ICON_PREFIX: string
    /** svg 图标集合 */
    readonly VITE_ICON_COLLECTION: string

    /** 使用mock数据 */
    readonly VITE_USE_MOCK: boolean
    /** 生产环境使用mock数据 */
    readonly VITE_PROD_MOCK: boolean
}

declare namespace User {
    type RoleType = 'admin' | 'user' | 'guest'

    interface UserInfo {
        /** 用户ID */
        userId: any
        /** 用户账号 */
        userName: string
        /** 用户姓名*/
        name: string
        /** 用户头像*/
        photoURL: string
        /** 用户角色 */
        userRole: RoleType
        /** 人员ID */
        personID: any
    }
}

declare namespace Common {
    type StrategyAction = [() => boolean, () => void]
}

declare namespace App {
    type GlobalMenuOption = {
        key: string | number
        label: string
        index: string
        icon: any
        children?: GlobalMenuOption[]
    } & Recordable
}
