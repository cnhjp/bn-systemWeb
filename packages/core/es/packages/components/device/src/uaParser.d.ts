import type { Regexes, Browser, CPU, Device, Engine, OS, UserAgent } from './types';
export declare class UAParser {
    static VERSION: any;
    static BROWSER: any;
    static CPU: any;
    static DEVICE: any;
    static ENGINE: any;
    static OS: any;
    ua: any;
    extensions: any;
    _ua: string;
    _regMap: Regexes;
    constructor(ua?: any, extensions?: Regexes);
    getBrowser(): Browser;
    getCPU(): CPU;
    getDevice(): Device;
    getEngine(): Engine;
    getOS(): OS;
    getResult(): UserAgent;
    getUA(): string;
    setUA(ua: string): this;
}
