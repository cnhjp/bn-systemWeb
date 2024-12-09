import DownloadUtil from 'downloadjs'

export { DownloadUtil }

/**
 * 定义原型对象
 * @param target 目标对象
 * @param prop 属性名称
 * @param callback 回调函数
 */
export function definePrototype(
  target: Function,
  prop: string,
  callback: Function
): void {
  target.prototype[prop] = function () {
    return callback(this, ...arguments)
  }
}

/**
 * 定义访问器
 * @param target 目标对象
 * @param prop 属性名称
 * @param getter 访问函数
 * @param setter 设置函数
 */
export function defineGetter<T>(
  target: T,
  prop: PropertyKey,
  getter: () => any,
  setter: (value: any) => void
): void {
  Object.defineProperty(target, prop, {
    get: getter,
    set: setter,
    writable: false,
    enumerable: false,
    configurable: false
  })
}

/**
 * 定义只读属性
 * @param target 目标独享
 * @param prop 属性名称
 * @param value 属性值
 */
export function defineReadOnly<T>(
  target: T,
  prop: PropertyKey,
  value: any
): void {
  Object.defineProperty(target, prop, {
    value: value,
    writable: false,
    enumerable: false,
    configurable: false
  })
}

/**
 * 防抖函数
 * @param callback 回调函数
 * @param delay 推迟时间（秒）
 * @param immediate 是否第一次触发后执行
 */
export function debounce(
  func: Function,
  wait: number,
  options: Record<string, any>
) {
  let lastArgs: any,
    lastThis: any,
    maxWait: any,
    result: any,
    timerId: any,
    lastCallTime: any

  let lastInvokeTime: any = 0
  let leading: boolean = false
  let maxing: boolean = false
  let trailing: boolean = true

  if (typeof func !== 'function') {
    throw new TypeError('Expected a function')
  }
  wait = +wait || 0
  if (Object.prototype.toString.call(options) === '[object Object]') {
    leading = !!options.leading
    maxing = 'maxWait' in options
    maxWait = maxing ? Math.max(+options.maxWait || 0, wait) : maxWait
    trailing = 'trailing' in options ? !!options.trailing : trailing
  }

  function invokeFunc(time: any) {
    const args = lastArgs
    const thisArg = lastThis

    lastArgs = lastThis = undefined
    lastInvokeTime = time
    result = func.apply(thisArg, args)
    return result
  }

  function remainingWait(time: any) {
    const timeSinceLastCall = time - lastCallTime
    const timeSinceLastInvoke = time - lastInvokeTime
    const timeWaiting = wait - timeSinceLastCall

    return maxing
      ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting
  }

  function shouldInvoke(time: any) {
    const timeSinceLastCall = time - lastCallTime
    const timeSinceLastInvoke = time - lastInvokeTime
    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxing && timeSinceLastInvoke >= maxWait)
    )
  }

  function timerExpired() {
    const time = Date.now()
    if (shouldInvoke(time)) {
      return trailingEdge(time)
    }
    timerId = setTimeout(timerExpired, remainingWait(time))
  }

  function trailingEdge(time: any) {
    timerId = undefined
    if (trailing && lastArgs) {
      return invokeFunc(time)
    }
    lastArgs = lastThis = undefined
    return result
  }

  function debounced(this: any, ...args: any) {
    const time = Date.now()
    const isInvoking = shouldInvoke(time)

    lastArgs = args
    lastThis = this
    lastCallTime = time

    if (isInvoking) {
      if (timerId === undefined) {
        lastInvokeTime = lastCallTime
        timerId = setTimeout(timerExpired, wait)
        return leading ? invokeFunc(lastCallTime) : result
      }
      if (maxing) {
        timerId = setTimeout(timerExpired, wait)
        return invokeFunc(lastCallTime)
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait)
    }
    return result
  }
  debounced.cancel = (id: any) => {
    clearTimeout(id)
  }
  debounced.flush = () => {
    timerId === undefined ? result : trailingEdge(Date.now())
  }
  debounced.pending = timerId !== undefined
  return debounced
}

/**
 * 将计划串成职责链
 * @param plans 计划集合
 * @returns
 */
export function toPlanChains(this: any, plans: Array<Function>): Function {
  const context: any[] = []
  const setNextPlan = (prePlan: Function, nextPlan: Function) => {
    return async function (this: any, ...args: any[]) {
      const preResult = await prePlan.call(this, ...args)
      if (preResult !== context) context.push(preResult)
      const nextResult = await nextPlan.call(this, ...args)
      if (nextResult !== context) context.push(nextResult)
      return context
    }
  }
  return plans.length > 0
    ? plans.reduce(setNextPlan)
    : () => Promise.resolve(context)
}

/**
 * 数据克隆（深拷贝）
 * @param source 来源对象
 * @param target 目标对象
 * @returns {*} 拷贝结果
 */
export function clone(source: any, target?: any): any {
  const sourceType = Object.prototype.toString.call(source)
  if (sourceType === '[object Array]') {
    source.reduce((result: any[], value: any) => {
      result.push(clone(value))
      return result
    }, target || (target = []))
  } else if (sourceType === '[object Object]') {
    Object.keys(source).reduce((result, key) => {
      result[key] = clone(source[key])
      return result
    }, target || (target = {}))
  } else {
    target = source
  }
  return target
}

/**
 * 路径操作类
 */
export class Path {
  /**
   * 查询参数转参数对象
   * @param search 查询参数
   */
  static toObject(search: string): Object {
    const pos = search.indexOf('?')
    if (pos > -1) search = search.substring(pos + 1)
    return search
      .split('&')
      .reduce((result: Record<string, string>, item: string) => {
        const [key, value] = item.split('=')
        if (key) {
          result[key] = value
        }
        return result
      }, {})
  }

  /**
   * 参数对象转查询参数
   * @param object 参数对象
   */
  static toSearch(object: Record<string, any>): string {
    const searchArr = Object.keys(object).reduce((result: string[], key) => {
      result.push(`${key}=${object[key]}`)
      return result
    }, [])
    return searchArr.join('&')
  }

  /**
   * 获取查询参数字符串
   * @param url 路径
   */
  static getString(url: string): string {
    const a = document.createElement('a')
    a.href = url
    return a.search
  }

  /**
   * 获取路径参数对象
   * @param url 路径
   */
  static getSearch(url: string): Object {
    const search = Path.getString(url)
    return Path.toObject(search)
  }

  /**
   * 设置路径查询参数
   * @param url 路径
   * @param data 参数对象
   */
  static setSearch(url: string, data: Object): string {
    const searchObject = Object.assign(Path.getSearch(url), data)
    const searchString = Path.toSearch(searchObject)
    const a = document.createElement('a')
    a.href = url
    a.search = searchString
    return a.href
  }

  /**
   * 通过路径获取文件后缀名
   * @param url 路径
   */
  static getSuffix(url: string): string | null {
    const pos = url.lastIndexOf('.')
    if (pos > -1) {
      return url.substring(pos)
    }
    return null
  }
}

/**
 * 类型操作类
 */
export class Types {
  static Unknown: Symbol = Symbol('unknown')
  static String: Symbol = Symbol('string')
  static Number: Symbol = Symbol('number')
  static Object: Symbol = Symbol('object')
  static Array: Symbol = Symbol('array')

  private static parse(arg: any) {
    return Object.prototype.toString.call(arg)
  }

  /**
   * 是否对象类型
   * @param arg 参数
   */
  static isObject(arg: any): boolean {
    return this.parse(arg) === '[object Object]'
  }

  /**
   * 是否数组类型
   * @param arg 参数
   */
  static isArray(arg: any): boolean {
    return this.parse(arg) === '[object Array]'
  }

  /**
   * 是否数字类型
   * @param arg 参数
   */
  static isNumber(arg: any): boolean {
    return this.parse(arg) === '[object Number]'
  }

  /**
   * 是否字符串类型
   * @param arg 参数
   */
  static isString(arg: any): boolean {
    return this.parse(arg) === '[object String]'
  }
}
