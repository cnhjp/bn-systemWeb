import { makePluginInstaller } from '@packages/utils/installer'

/**
 * 全局唯一标识（uuid）
 * @param separator 分隔符
 */
export function uuid(separator: string = '-'): string {
  const S4 = () =>
    (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)

  const uuid = [S4() + S4(), S4(), S4(), S4(), S4() + S4() + S4()]
  return uuid.join(separator).toLowerCase()
}

/**
 * 范围随机数
 * @param lower {number} 最小值
 * @param upper {number} 最大值
 */
export function scopeRandom(lower: number, upper: number): number {
  return Math.floor(Math.random() * (upper - lower + 1)) + lower
}

export default makePluginInstaller(() => {
  Math.uuid = uuid
  Math.scopeRandom = scopeRandom
})
