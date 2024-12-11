import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer'
import api from './api'

export async function setupMockServer() {
    await createProdMockServer(api)
}
