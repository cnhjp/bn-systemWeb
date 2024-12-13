import { makePluginInstaller } from '@packages/utils/installer'

/**
 * 是否空字符串
 * @param value 字符串
 */
export function isEmpty(value: string): boolean {
  return value === null || value.trim() === ''
}

/**
 * 是否非空字符串
 * @param value 字符串
 */
export function isNotEmpty(value: string): boolean {
  return value !== null && value.trim() !== ''
}

/**
 * 替换内容占位符 ${xxx}
 * @param value 内容
 * @param data 替换对象
 */
export function replace(value: string, data: Record<string, string>): string {
  return value.replace(/\${([^}]+)}/g, function(match, char, index) {
    if (char in (data || {})) {
      return data[char]
    } else {
      return match
    }
  })
}

export default makePluginInstaller(() => {
  String.replace = replace
  String.isEmpty = isEmpty
  String.isNotEmpty = isNotEmpty
})
