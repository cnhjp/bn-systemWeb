import type { PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import viteLegacy from '@vitejs/plugin-legacy'
import unocss from 'unocss/vite'
import progress from 'vite-plugin-progress'

import unplugin from './unplugin'
import Visualizer from './visualizer'
import Compress from './compress'
import Theme from './theme'
import mock from './mock'

export function setupVitePlguins(viteEnv: ImportMetaEnv): PluginOption[] {
    const plugins: PluginOption[] = [
        Theme({ themes: ['theme-norm', 'theme-chalk'] }),
        vue(),
        vueJsx(),
        viteLegacy({
            targets: ['> 1%, last 1 version, ie >= 11', 'chrome 52'],
            // 面向IE11时需要此插件
            additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
        }),
        ...unplugin(viteEnv),
        unocss(),
        progress(),
        mock(viteEnv),
    ]

    if (viteEnv.VITE_VISUALIZER) {
        plugins.push(Visualizer(viteEnv))
    }

    if (viteEnv.VITE_COMPRESS) {
        plugins.push(Compress(viteEnv))
    }

    return plugins
}
