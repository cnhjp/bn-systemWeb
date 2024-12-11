import { viteMockServe } from 'vite-plugin-mock'

export default (viteEnv: ImportMetaEnv) => {
    return viteMockServe({
        mockPath: 'mock',
        localEnabled: viteEnv.VITE_USE_MOCK,
        prodEnabled: viteEnv.VITE_PROD_MOCK,
        injectCode: `
        import { setupMockServer } from '../mock';
        setupMockServer();
        `,
    })
}
