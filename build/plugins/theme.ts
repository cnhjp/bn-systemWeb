import path from 'path'
import sass from 'sass'
import fs from 'fs'
import { projRoot } from '../utils'

import type { PluginOption, HmrContext } from 'vite'
import type { NormalizedInputOptions } from 'rollup'

export type ThemeOptions = {
    /**
     * 主题根目录（默认：./src/styles）
     */
    base?: string
    /**
     * 主题入口文件（默认：index.scss）
     */
    entry?: string
    /**
     * 主题输出目录（默认：./public/themes)
     */
    output?: string
    /**
     * 皮肤集合（与目录同名）
     */
    themes: Array<any>
}

export default (options: ThemeOptions): PluginOption => {
    const styleRoot = path.resolve(projRoot, options.base || './src/styles').replace(/\\/g, '/')
    const entryRoot = options.entry || 'index.scss'
    const themeMaps = options.themes.map((name) => {
        return {
            name: name,
            path: `${styleRoot}/${name}/${entryRoot}`,
        }
    })

    function writeFile(filename: string, content: string) {
        const { dir } = path.parse(filename)
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true })
        }
        fs.writeFileSync(filename, content)
    }

    async function generateTheme() {
        for (const theme of themeMaps) {
            const { css } = await sass.compileAsync(theme.path)
            const filename = path.resolve(projRoot, options.output || './public/themes', theme.name + '.css')
            writeFile(filename, css)
        }
    }

    return {
        name: 'vite:theme-sass',
        enforce: 'pre',
        async buildStart(opt: NormalizedInputOptions) {
            console.log(`[${Date.now()}] buildStart：编译SASS`)
            await generateTheme()
        },
        async handleHotUpdate(ctx: HmrContext) {
            const { file } = ctx
            if (file.indexOf(styleRoot) > -1) {
                console.log(`[${Date.now()}] handleHotUpdate：更新SASS`)
                await generateTheme()
            }
        },
    }
}
