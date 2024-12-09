import { makePluginInstaller } from '@packages/utils/installer'

/**
 * 是否空值或为零
 * @param value 数值
 */
export function isNullOrZero(value: number | string): boolean {
  return isNaN(Number(value)) || Number(value) === 0
}

/**
 * 是否非空值或不为零
 * @param value 数值
 */
export function isNotNullOrZero(value: number | string): boolean {
  return !isNaN(Number(value)) && Number(value) !== 0
}

export default makePluginInstaller(() => {
  Number.isNullOrZero = isNullOrZero
  Number.isNotNullOrZero = isNotNullOrZero
})
