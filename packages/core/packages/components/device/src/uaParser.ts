import {
    LIBVERSION,
    EMPTY,
    UNDEF_TYPE,
    OBJ_TYPE,
    STR_TYPE,
    MAJOR,
    MODEL,
    NAME,
    TYPE,
    VENDOR,
    VERSION,
    ARCHITECTURE,
    CONSOLE,
    MOBILE,
    TABLET,
    SMARTTV,
    WEARABLE,
    EMBEDDED,
    UA_MAX_LENGTH,
    regexes
} from './constants'
import {toEnumeration, extend, rgxMapper, toMajor, trim} from './helper'
import type {Regexes, Browser, CPU, Device, Engine, OS, UserAgent} from './types'

export class UAParser {
    static VERSION: any = LIBVERSION
    static BROWSER: any = toEnumeration([NAME, VERSION, MAJOR])
    static CPU: any = toEnumeration([ARCHITECTURE])
    static DEVICE: any = toEnumeration([
        MODEL,
        VENDOR,
        TYPE,
        CONSOLE,
        MOBILE,
        SMARTTV,
        TABLET,
        WEARABLE,
        EMBEDDED
    ])
    static ENGINE: any = toEnumeration([NAME, VERSION])
    static OS: any = toEnumeration([NAME, VERSION])

    ua: any
    extensions: any
    _ua: string
    _regMap: Regexes

    constructor(ua?: any, extensions?: Regexes) {
        if (typeof ua === OBJ_TYPE) {
            this.extensions = ua
            this.ua = undefined
        }
        this._ua = this.ua || (typeof window !== UNDEF_TYPE && window.navigator && window.navigator.userAgent ? window.navigator.userAgent : EMPTY)
        this._regMap = extensions ? extend(regexes, extensions) : regexes
    }

    getBrowser(): Browser {
        const _browser: Browser = {}
        _browser[NAME] = undefined
        _browser[VERSION] = undefined
        rgxMapper.call(_browser, this._ua, this._regMap.browser)
        _browser.major = toMajor(_browser.version)
        return _browser
    }

    getCPU(): CPU {
        const _cpu: CPU = {}
        _cpu[ARCHITECTURE] = undefined
        rgxMapper.call(_cpu, this._ua, this._regMap.cpu)
        return _cpu
    }

    getDevice(): Device {
        const _device: Device = {}
        _device[VENDOR] = undefined
        _device[MODEL] = undefined
        _device[TYPE] = undefined
        rgxMapper.call(_device, this._ua, this._regMap.device)
        return _device
    }

    getEngine(): Engine {
        const _engine: Engine = {}
        _engine[NAME] = undefined
        _engine[VERSION] = undefined
        rgxMapper.call(_engine, this._ua, this._regMap.engine)
        return _engine
    }

    getOS(): OS {
        const _os: OS = {}
        _os[NAME] = undefined
        _os[VERSION] = undefined
        rgxMapper.call(_os, this._ua, this._regMap.os)
        return _os
    }

    getResult(): UserAgent {
        return {
            ua: this.getUA(),
            browser: this.getBrowser(),
            engine: this.getEngine(),
            os: this.getOS(),
            device: this.getDevice(),
            cpu: this.getCPU()
        }
    }

    getUA(): string {
        return this._ua
    }

    setUA(ua: string) {
        this._ua = typeof ua === STR_TYPE && ua.length > UA_MAX_LENGTH ? trim(ua, UA_MAX_LENGTH) : ua
        return this
    }
}
