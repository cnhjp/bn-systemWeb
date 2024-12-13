interface ArrayConstructor {
  /**
   * 是否空数组（数组为null或者数组长度等于0）
   * @param arr 数组对象
   */
  isEmpty(arr: any): boolean

  /**
   * 是否非空数组（数组不为空并且数组长度大于0）
   * @param arr 数组对象
   */
  isNotEmpty(arr: any): boolean

  /**
   * 数组去重
   * @param arr 数组对象
   * @param field 属性字段
   */
  unique<T>(arr: Array<T>, field: string): void

  /**
   * 删除元素
   * @param arr 数组
   * @param selector 选择器
   */
  remove<T>(
    arr: Array<T>,
    selector: ((value: T, index: number, array: T[]) => boolean) | T
  ): number
}

declare interface DateConstructor {
  /**
   * 时区转换
   * @param date 时间对象
   * @param zone 时区数值
   */
  toZone(date: Date | string, zone: number): Date

  /**
   * 时间对象格式化
   * @param date 时间对象
   * @param format 格式化对象
   */
  format(date: Date | string, format: string): string
}

declare interface NumberConstructor {
  /**
   * 是否空值或为零
   * @param value 数值
   */
  isNullOrZero(value: number | string): boolean

  /**
   * 是否非空值或不为零
   * @param value 数值
   */
  isNotNullOrZero(value: number | string): boolean
}

declare interface StringConstructor {
  /**
   * 是否空字符串
   * @param value 字符串
   */
  isEmpty(value: string): boolean

  /**
   * 是否非空字符串
   * @param value 字符串
   */
  isNotEmpty(value: string): boolean

  /**
   * 替换内容占位符
   * @param value 内容
   * @param data 替换对象
   */
  replace(value: string, data: Dynamic): string
}

declare interface Math {
  /**
   * 全局唯一标识（uuid）
   * @param separator 分隔符
   */
  uuid(separator: string = '-'): string

  /**
   * 范围随机数
   * @param lower 最小值
   * @param upper 最大值
   */
  scopeRandom(lower: number, upper: number): number
}
