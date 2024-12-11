import { defineConfig } from '@unocss/vite'
import presetUno from '@unocss/preset-uno'
import transformerDirectives from '@unocss/transformer-directives'

export default defineConfig({
    presets: [presetUno({ dark: 'class' })],
    transformers: [transformerDirectives()],
    // 快捷方式，可以将多个规则组合在一起
    shortcuts: {
        'wh-full': 'w-full h-full',
        'flex-col': 'flex flex-col',
        'flex-col-center': 'flex-col flex-center',
        'flex-row': 'flex flex-row',
        'flex-row-center': 'flex-row flex-center',
        'flex-center': 'flex justify-center items-center',
        'flex-align-center': 'flex items-center',
        'flex-justify-center': 'flex justify-center',
        'nowrap-hidden': 'whitespace-nowrap overflow-hidden',
    },
    theme: {
        colors: {
            primary: 'rgba(var(--primary-color))',
            primary_hover: 'rgba(var(--primary-color-hover))',
            primary_pressed: 'rgba(var(--primary-color-pressed))',
            primary_active: 'rgba(var(--primary-color-active),0.1)',
        },
    },
    content: {
        pipeline: {
            exclude: ['node_modules', 'dist', '.git', '.husky', '.vscode', 'public', 'build', 'mock'],
        },
    },
})
