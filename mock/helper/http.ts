import type { MockMethod } from 'vite-plugin-mock'
import { mock, type MockjsMock } from 'mockjs'
import { HttpStatus, HttpMethod } from './enums'
import { UnauthorizedError } from './errors'

export type HttpHandler = (
    context: {
        url: Recordable
        body: Recordable
        query: Recordable
        headers: Recordable
    },
    mock: MockjsMock,
) => void

export const HttpResponse = {
    success: (data: any) => ({
        code: HttpStatus.SUCCESS,
        data: data,
        desc: 'success',
    }),
    unauthorized: (error: Error) => ({
        code: HttpStatus.UNAUTHORIZED,
        data: null,
        desc: error.message,
    }),
    error: (status: HttpStatus, error: Error) => ({
        code: status,
        data: null,
        desc: error.message,
    }),
}

export const useHttpMock = (
    method: HttpMethod,
    url: string,
    handler: HttpHandler,
    isAuthorized: boolean = false,
): MockMethod => {
    return {
        url: url,
        method: method,
        response(ctx) {
            try {
                if (isAuthorized && !ctx.headers.authorization) {
                    throw new UnauthorizedError('未授权')
                }
                const result = handler(ctx, mock)
                return {
                    code: HttpStatus.SUCCESS,
                    data: result,
                    desc: HttpStatus[HttpStatus.SUCCESS],
                }
            } catch (error: any) {
                return HttpResponse.error(error.status || HttpStatus.SYSTEM_ERROR, error)
            }
        },
    }
}
