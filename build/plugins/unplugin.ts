import type { PluginOption } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { projRoot, srcRoot } from '../utils'

import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default function unplugin(viteEnv: ImportMetaEnv): PluginOption[] {
    const iconPrefix = viteEnv.VITE_ICON_PREFIX
    const iconCollection = viteEnv.VITE_ICON_COLLECTION
    const localIconPath = `${srcRoot}/assets/svg`

    const plugins: PluginOption[] = [
        AutoImport({
            dts: `${projRoot}/typings/auto-imports.d.ts`,
            imports: ['vue', 'vue-router', 'pinia', '@vueuse/core'],
            resolvers: [ElementPlusResolver(), IconsResolver({ prefix: 'Icon' })],
        }),
        Components({
            dts: `${projRoot}/typings/components.d.ts`,
            types: [{ from: 'vue-router', names: ['RouterLink', 'RouterView'] }],
            resolvers: [
                ElementPlusResolver(),
                IconsResolver({
                    enabledCollections: ['ep'],
                    customCollections: [iconCollection],
                    prefix: iconPrefix,
                }),
            ],
        }),
        Icons({
            compiler: 'vue3',
            scale: 1,
            autoInstall: true,
            defaultClass: 'inline-block',
            defaultStyle: 'width: 1em; height: 1em;',
            customCollections: {
                [iconCollection]: FileSystemIconLoader(localIconPath, (svg: string) => {
                    // return svg.replace(/^<svg\s/, '<svg width="1em" height="1em" ')
                    return svg
                }),
            },
        }),
        createSvgIconsPlugin({
            iconDirs: [localIconPath],
            symbolId: `${iconPrefix}-${iconCollection}-[dir]-[name]`,
            inject: 'body-last',
            customDomId: '__SVG_ICON_LOCAL__',
        }),
    ]

    return plugins
}
