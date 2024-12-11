import type { PluginOption } from 'vite'
import ViteCompression from 'vite-plugin-compression'

export default (viteEnv: ImportMetaEnv): PluginOption => {
    return ViteCompression({
        algorithm: 'gzip',
        verbose: true,
        disable: false,
        threshold: 10240,
        ext: '.gz',
    })
}
