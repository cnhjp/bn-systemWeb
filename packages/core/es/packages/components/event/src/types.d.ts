export interface EventFunction {
    (...args: any[]): void;
}
export declare type Events = Record<string, Array<EventFunction>>;
export declare type Prop = (key: string, value: any, opts?: PropertyDescriptor) => void;
