import { defineStore, StateTree, _GettersTree } from 'pinia'
import { nextTick } from 'vue'

const themes = ['theme-norm', 'theme-chalk']

const themeCaches: any = {}

export interface AppStoreState extends StateTree {
    /** 重载页面(控制页面的显示) */
    reloadFlag: boolean
    /** 主题集合 */
    themes: string[]
    /** 当前主题 */
    theme: string
    /** 样式对象 */
    style?: HTMLElement
    /** 全局加载状态 */
    loading: boolean
    /** 侧边栏折叠状态 */
    siderCollapse: boolean
}

export interface AppStoreGetters extends _GettersTree<AppStoreState> {}

export interface AppStoreActions {
    reloadPage: (duration: number) => Promise<void>
    switchTheme: (theme?: string) => Promise<void>
    toggleLoading: (loading: boolean) => void
    toggleSiderCollapse: () => void
}

export const useAppStore = defineStore<string, AppStoreState, AppStoreGetters, AppStoreActions>('app-store', {
    state: (): AppStoreState => {
        return {
            reloadFlag: true,
            themes: themes,
            theme: '',
            style: undefined,
            loading: false,
            siderCollapse: false,
        }
    },
    getters: {},
    actions: {
        async reloadPage(duration = 0) {
            this.reloadFlag = false
            await nextTick()
            if (duration) {
                setTimeout(() => {
                    this.reloadFlag = true
                }, duration)
            } else {
                this.reloadFlag = true
            }
            setTimeout(() => {
                document.documentElement.scrollTo({ left: 0, top: 0 })
            }, 100)
        },
        async switchTheme(theme?: string) {
            this.theme = theme || this.theme || this.themes[0]
            if (this.style === undefined) {
                this.style = document.createElement('style')
                this.style.setAttribute('type', 'text/css')
                document.head.appendChild(this.style)
            }
            if (themeCaches[this.theme]) {
                this.style!.innerHTML = themeCaches[this.theme]
                this.style!.setAttribute('data-theme', this.theme)
            } else {
                const response = await fetch(`/themes/${this.theme}.css`)
                const text = await response.text()
                this.style!.innerHTML = text
                this.style!.setAttribute('data-theme', this.theme)
                themeCaches[this.theme] = text
            }
        },
        toggleLoading(loading: boolean) {
            this.loading = loading || !this.loading
            // ElLoading.service({
            //     text: '加载中...',
            //     fullscreen: true,
            //     svg: `<path class="path" d="M 30 15 L 28 17 M 25.61 25.61 A 15 15, 0, 0, 1, 15 30 A 15 15, 0, 1, 1, 27.99 7.5 L 15 15 " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>`,
            //     svgViewBox: '-10, -10, 50, 50',
            // })
        },
        toggleSiderCollapse() {
            this.siderCollapse = !this.siderCollapse
        },
    },
})
