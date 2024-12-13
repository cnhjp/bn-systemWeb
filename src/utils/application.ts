import { Application } from '@package/core'

export class CommonApplication extends Application {
    public readonly driver: Record<string, any>
    public readonly services: Record<string, any>

    constructor() {
        super()
        this.driver = {}
        this.services = {}
    }

    async init(_opts: Record<string, any>): Promise<any> {}
}

export const comApp = new CommonApplication()
