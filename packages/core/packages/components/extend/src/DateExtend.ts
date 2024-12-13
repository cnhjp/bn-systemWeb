import { definePrototype } from '@packages/components/core'
import { makePluginInstaller } from '@packages/utils/installer'

const DateTimeI18n = {
  Week: [
    ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'],
    [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday'
    ],
    ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
  ],
  Month: [
    [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ],
    [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ]
  ],
  AP: [
    ['AM', 'PM'],
    ['上午', '下午']
  ]
}

/**
 * 时区转换
 * @param date 时间对象
 * @param zone 时区数值
 */
export function toZone(date: Date | string, zone: number): Date {
  if (typeof date === 'string') date = new Date(date)
  // 获取当前时间戳
  const localTime = date.getTime()
  // 获取当前时区和GMT时间（格林威治时间）的差值
  const localOffset = date.getTimezoneOffset() * 60 * 1000
  // GMT时间，既格林威治时间
  const gmt = localTime + localOffset
  return new Date(gmt + zone * 60 * 60 * 1000)
}

/**
 * 时间对象格式化
 * @param date 时间对象
 * @param format 格式化对象
 */
export function format(date: Date | string, format: string): string {
  if (typeof date === 'string') date = new Date(date)
  const y = date.getFullYear()
  const m = date.getMonth()
  const d = date.getDate()
  const h = date.getHours()
  const i = date.getMinutes()
  const s = date.getSeconds()
  const w = date.getDay()

  const toReplace = (
    key: RegExp,
    value: number | string,
    maxLength: number = 0
  ) => {
    if (maxLength > 0) {
      value = String(value).padStart(maxLength, '0')
    }
    format = format.replace(key, String(value))
  }

  toReplace(/yyyy/, y, 4)
  toReplace(/MMMM/, DateTimeI18n.Month[1][m], 2)
  toReplace(/MMM/, DateTimeI18n.Month[0][m], 2)
  toReplace(/MM/, m + 1, 2)
  toReplace(/M/, m + 1)
  toReplace(/dd/, d, 2)
  toReplace(/d/, d)
  toReplace(/HH/, d, 2)
  toReplace(/H/, d, 2)
  toReplace(/hh/, d > 12 ? h - 12 : h, 2)
  toReplace(/h/, d > 12 ? h - 12 : h)
  toReplace(/mm/, i, 2)
  toReplace(/m/, i)
  toReplace(/ss/, s, 2)
  toReplace(/s/, s)
  toReplace(/tt/, DateTimeI18n.AP[1][Number(h > 12)])
  toReplace(/t/, DateTimeI18n.AP[0][Number(h > 12)])
  toReplace(/cw/, DateTimeI18n.Week[2][w - 1])
  toReplace(/www/, DateTimeI18n.Week[1][w - 1])
  toReplace(/ww/, DateTimeI18n.Week[0][w - 1])
  toReplace(/w/, w)

  return format
}

export default makePluginInstaller(() => {
  Date.toZone = toZone
  Date.format = format
  definePrototype(Date, 'toZone', toZone)
  definePrototype(Date, 'format', format)
})
