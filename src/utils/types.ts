enum TYPE {
    String = '[object String]',
    Number = '[object Number]',
    Array = '[object Array]',
    Object = '[object Object]',
    Date = '[object Date]',
    Function = '[object Function]',
    Null = '[object Null]',
    Undefined = '[object Undefined]',
}

const callTypeof = (value: any) => Object.prototype.toString.call(value)

export class TypeAssert {
    static isString(value: any): value is string {
        return callTypeof(value) === TYPE.String
    }
    static isNumber(value: any): value is number {
        return callTypeof(value) === TYPE.Number
    }
    static isArray<T>(value: any): value is Array<T> {
        return callTypeof(value) === TYPE.Array
    }
    static isObject(value: any): value is object {
        return callTypeof(value) === TYPE.Object
    }
    static isDate(value: any): value is Date {
        return callTypeof(value) === TYPE.Date
    }
    static isFunction<T>(value: any): value is (...args: any) => T {
        return callTypeof(value) === TYPE.Function
    }
    static isNull(value: any): value is null {
        return callTypeof(value) === TYPE.Null
    }
    static isUndefined(value: any): value is undefined {
        return callTypeof(value) === TYPE.Undefined
    }
}
