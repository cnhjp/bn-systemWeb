import type { PluginOption } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'

export default (viteEnv: ImportMetaEnv): PluginOption => {
    return visualizer({
        filename: 'stats.html',
        gzipSize: true,
        brotliSize: true,
        open: false,
        emitFile: true,
    })
}
