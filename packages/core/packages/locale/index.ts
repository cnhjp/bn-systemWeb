export { default as zhCn } from './lang/zh-cn'

export type TranslatePair = {
  [key: string]: string | string[] | TranslatePair
}

export type Language = {
  name: string
  lang: TranslatePair
}
