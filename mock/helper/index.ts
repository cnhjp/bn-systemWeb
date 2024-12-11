import { useHttpMock, type HttpHandler } from './http'
import { HttpMethod } from './enums'

export const httpMock = {
    get: (url: string, handler: HttpHandler) => useHttpMock(HttpMethod.Get, url, handler, false),
    getAuth: (url: string, handler: HttpHandler) => useHttpMock(HttpMethod.Get, url, handler, true),
    post: (url: string, handler: HttpHandler) => useHttpMock(HttpMethod.Post, url, handler, false),
    postAuth: (url: string, handler: HttpHandler) => useHttpMock(HttpMethod.Post, url, handler, true),
    put: (url: string, handler: HttpHandler) => useHttpMock(HttpMethod.Put, url, handler, false),
    putAuth: (url: string, handler: HttpHandler) => useHttpMock(HttpMethod.Put, url, handler, true),
    delete: (url: string, handler: HttpHandler) => useHttpMock(HttpMethod.Delete, url, handler, false),
    deleteAuth: (url: string, handler: HttpHandler) => useHttpMock(HttpMethod.Delete, url, handler, true),
}

export * from './http'
export * from './enums'
