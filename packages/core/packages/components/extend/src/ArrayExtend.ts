import { definePrototype } from '@packages/components/core'
import { makePluginInstaller } from '@packages/utils/installer'

/**
 * 是否空数组（数组为null或者数组长度等于0）
 * @param arr 数组对象
 */
export function isEmpty(arr: any): boolean {
  if (Array.isArray(arr)) {
    return arr == null || arr.length === 0
  }
  return false
}

/**
 * 是否非空数组（数组不为空并且数组长度大于0）
 * @param arr 数组对象
 */
export function isNotEmpty(arr: any): boolean {
  return Array.isArray(arr) && arr.length > 0
}

/**
 * 数组去重
 * @param arr 数组对象
 * @param field 属性字段
 */
export function unique<T>(arr: Array<T>, field: string): void {
  const apply = (item: T) =>
    item instanceof Object ? (<any>item)[field] : item
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length;) {
      if (apply(arr[i]) === apply(arr[j])) {
        arr.splice(j, 1)
      } else {
        j++
      }
    }
  }
}

/**
 * 删除元素
 * @param arr 数组
 * @param selector 选择器
 */
export function remove<T>(
  arr: Array<T>,
  selector: ((value: T, index: number, array: T[]) => boolean) | T
): number {
  if (selector instanceof Function) {
    return arr.filter(selector).reduce((count: number, item: T) => {
      return count + remove(arr, item)
    }, 0)
  }
  const pos = arr.indexOf(selector)
  if (pos > -1) {
    return arr.splice(pos, 1).length
  }
  return 0
}

export default makePluginInstaller(() => {
  Array.isEmpty = isEmpty
  Array.isNotEmpty = isNotEmpty
  // Array.unique = unique
  Array.remove = remove
  definePrototype(Array, 'unique', unique)
  definePrototype(Array, 'remove', remove)
})
