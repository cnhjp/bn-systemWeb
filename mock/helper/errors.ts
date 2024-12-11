import { HttpStatus } from './enums'

export class BusinessError extends Error {
    status: number

    constructor(message: string) {
        super(message)
        this.status = HttpStatus.CUSTOM_ERROR
    }
}

export class UnauthorizedError extends Error {
    status: number

    constructor(message: string) {
        super(message)
        this.status = HttpStatus.UNAUTHORIZED
    }
}

export class SystemError extends Error {
    status: number

    constructor(message: string) {
        super(message)
        this.status = HttpStatus.SYSTEM_ERROR
    }
}
