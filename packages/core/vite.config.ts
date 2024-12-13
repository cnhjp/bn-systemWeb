import {defineConfig} from 'vite'
import path, {resolve} from 'path'
import vue from '@vitejs/plugin-vue'
import Markdown from 'vite-plugin-md'

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@src': path.join(__dirname, './src'),
            '@packages': path.join(__dirname, './packages')
        }
    },
    plugins: [vue({include: [/\.vue$/, /\.md$/]}), Markdown()],
    server: {
        host: '0.0.0.0',
        port: 8080
    }
})
