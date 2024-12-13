export interface EventFunction {
    (...args: any[]): void
}

export type Events = Record<string, Array<EventFunction>>

export type Prop = (key: string, value: any, opts?: PropertyDescriptor) => void
