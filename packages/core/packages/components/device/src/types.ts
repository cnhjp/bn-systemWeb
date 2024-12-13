export declare type Regexes = {
    browser: any[],
    cpu: any[],
    device: any[],
    engine: any[],
    os: any[]
} & Record<string, any>

export declare type Browser = {
    name?: string,
    version?: string,
    major?: string
}

export declare type CPU = {
    architecture?: string
}

export declare type Device = {
    vendor?: string,
    model?: string,
    type?: string
}

export declare type Engine = {
    name?: string,
    version?: string
}

export declare type OS = {
    name?: string,
    version?: string
}

export declare type UserAgent = {
    ua: string,
    browser: Browser,
    engine: Engine,
    os: OS,
    device: Device,
    cpu: CPU
}
