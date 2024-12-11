import { defineConfig, loadEnv, type ConfigEnv, type UserConfig } from 'vite'
import { projRoot, srcRoot, wrapperEnv, setupVitePlguins } from './build'

export default defineConfig((env: ConfigEnv): UserConfig => {
    const confEnv = loadEnv(env.mode, process.cwd())
    const viteEnv = wrapperEnv(confEnv)

    return {
        base: viteEnv.VITE_BASE_URL,
        resolve: {
            alias: {
                '~': projRoot,
                '@': srcRoot,
            },
        },
        plugins: setupVitePlguins(viteEnv),
        server: {
            host: '0.0.0.0',
            port: viteEnv.VITE_PORT,
            open: viteEnv.VITE_OPEN,
            proxy: {
                '/proxy': {
                    target: '/',
                    changeOrigin: true,
                    rewrite: (path: string) => path.replace(/^\/proxy/, ''),
                },
            },
        },
        build: {
            /** 启用/禁用 gzip 压缩大小报告 */
            reportCompressedSize: false,
            /** 构建后是否生成 source map 文件 */
            sourcemap: false,
            /** 小于此阈值的导入或引用资源将内联为 base64 编码，以避免额外的 http 请求。设置为 0 可以完全禁用此项 */
            assetsInlineLimit: 4096,
            commonjsOptions: {
                ignoreTryCatch: false,
            },
            /** 规定触发警告的 chunk 大小 */
            chunkSizeWarningLimit: 1500,
            /** Rollup 打包配置 */
            rollupOptions: {
                output: {
                    /** 引入文件名的名称 */
                    chunkFileNames: 'js/[name]-[hash].js',
                    /** 包的入口文件名称 */
                    entryFileNames: 'js/[name]-[hash].js',
                    /** 资源文件像 字体，图片等 */
                    assetFileNames: '[ext]/[name]-[hash].[ext]',
                    /** 该选项允许你创建自定义的公共 chunk */
                    manualChunks(id) {
                        if (id.includes('node_modules')) {
                            const ids = id.toString().split('/')
                            const idx = ids.lastIndexOf('node_modules')
                            return ids[idx + 1]
                            // return id.toString().split('node_modules/').pop().split('/')[0].toString()
                        }
                    },
                },
            },
        },
    }
})
